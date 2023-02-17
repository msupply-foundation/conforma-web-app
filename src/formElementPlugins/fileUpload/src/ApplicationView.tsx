import React, { useEffect, useState, useRef } from 'react'
import { Button, Icon, List, Segment } from 'semantic-ui-react'
import { nanoid } from 'nanoid'
import { ApplicationViewProps } from '../../types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { useUserState } from '../../../contexts/UserState'
import { postRequest } from '../../../utils/helpers/fetchMethods'
import { FileDisplay, FileDisplayWithDescription } from './components'
import getServerUrl from '../../../utils/helpers/endpoints/endpointUrlBuilder'

export interface FileResponseData {
  uniqueId: string
  filename: string
  fileUrl: string
  thumbnailUrl: string
  mimetype: string
  description?: string
}

interface FileUploadServerResponse {
  success: boolean
  fileData?: FileResponseData[]
}

export interface FileInfo {
  key: string
  filename: string
  loading: boolean
  error: boolean
  errorMessage?: string | null
  fileData?: FileResponseData | null
}

const ApplicationView: React.FC<ApplicationViewProps> = ({
  element,
  parameters,
  onSave,
  Markdown,
  currentResponse,
  applicationData,
}) => {
  const { getPluginStrings } = useLanguageProvider()
  const strings = getPluginStrings('fileUpload')
  const { isEditable } = element
  const {
    label,
    description,
    fileCountLimit,
    fileExtensions,
    fileSizeLimit,
    showDescription = false,
    ...fileOptions
  } = parameters

  // These values required for file upload query parameters:
  const {
    userState: { currentUser },
  } = useUserState()

  const application_response_id = currentResponse?.id
  const serialNumber = applicationData.serial

  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>(
    generateInitialFileData(currentResponse?.files ?? [])
  )
  const fileInputRef = useRef<any>(null)

  useEffect(() => {
    // Set response to null if no files
    if (uploadedFiles.length === 0) {
      onSave(null)
      return
    }
    // Only store files that aren't error or loading
    const fileDataToSave = uploadedFiles
      .filter(({ loading, error, fileData }) => !(loading || error) && fileData)
      .map(({ fileData }) => fileData)
    onSave({
      text: createTextString(fileDataToSave as FileResponseData[]),
      files: fileDataToSave,
    })
  }, [uploadedFiles])

  const errors = [
    {
      condition: (file: any) => uploadedFiles.map((f) => f.filename).includes(file.name),
      errorMessage: strings.ERROR_FILE_ALREADY_UPLOADED,
    },
    {
      condition: (file: any) =>
        fileExtensions && !fileExtensions.includes(file.name.split('.').pop().toLowerCase()),
      errorMessage: strings.ERROR_FILE_TYPE_NOT_PERMITTED,
    },
    {
      condition: (file: any) => file.size > fileSizeLimit * 1000,
      errorMessage: strings.ERROR_FILE_TOO_BIG,
    },
    {
      condition: (file: any, newFileData: FileInfo[]) => newFileData.length >= fileCountLimit,
      errorMessage: strings.ERROR_TOO_MANY_FILES,
    },
  ]

  const handleFiles = async (e: any) => {
    const newFileData: FileInfo[] = [...uploadedFiles]
    const files: any[] = Array.from(e.target.files)

    for (const file of files) {
      const error = errors.find((error) => error.condition(file, newFileData))
      if (error) {
        newFileData.unshift({
          key: nanoid(10),
          filename: file.name,
          loading: false,
          error: true,
          errorMessage: error.errorMessage,
        })
        file.error = true
      } else {
        const key = nanoid(10)
        newFileData.unshift({ key, filename: file.name, loading: true, error: false })
        file.key = key
      }
    }
    setUploadedFiles([...newFileData])
    files.forEach(async (file: any) => {
      if (file?.error) return
      const result: FileUploadServerResponse = await uploadFile(file, {
        serialNumber,
        userId: currentUser?.userId ?? null,
        applicationResponseId: application_response_id,
        ...fileOptions,
      })
      const index = newFileData.findIndex((f: any) => f.key === file.key)
      if (result.success) {
        newFileData[index] = {
          ...newFileData[index],
          loading: false,
          fileData: result?.fileData?.[0],
        }
      } else {
        newFileData[index] = {
          ...newFileData[index],
          loading: false,
          error: true,
          errorMessage: strings.ERROR_UPLOAD_PROBLEM,
        }
      }
      setUploadedFiles([...newFileData])
    })
  }

  const handleDelete = async (key: string) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.key !== key))
  }

  const handleUpdateDescription = async (uniqueId: string, value: string, key: string) => {
    try {
      // Save description to database file record
      await updateFileDescription(uniqueId, value || null)
      // Update response
      const index = uploadedFiles.findIndex((f) => f.key === key)
      const newFiles = [...uploadedFiles]
      newFiles[index].fileData = {
        ...newFiles[index].fileData,
        description: value,
      } as FileResponseData
      setUploadedFiles(newFiles)
    } catch (err) {
      console.warn('Error', err.message)
    }
  }

  return (
    <>
      {label && (
        <label>
          <Markdown text={label} semanticComponent="noParagraph" />
        </label>
      )}
      <Markdown text={description} />
      <Segment.Group>
        {/* Dummy input button required, as Semantic Button can't
        handle file input. Link between this input and Semantic
        Button done with useRef(fileInputRef) */}
        <input
          type="file"
          ref={fileInputRef}
          hidden
          name="file-upload"
          multiple={fileCountLimit > 1 || !fileCountLimit}
          onChange={handleFiles}
        />
        <Segment basic textAlign="center">
          {(uploadedFiles.length < fileCountLimit || !fileCountLimit) && (
            <Button primary disabled={!isEditable} onClick={() => fileInputRef?.current?.click()}>
              <Icon name="upload" />
              {uploadedFiles.length === 0
                ? strings.BUTTON_CLICK_TO_UPLOAD
                : strings.BUTTON_UPLOAD_ANOTHER}
            </Button>
          )}
        </Segment>
        <List className="file-list" horizontal={!showDescription} verticalAlign="top">
          {uploadedFiles.map((file) =>
            showDescription ? (
              <FileDisplayWithDescription
                key={file.key}
                file={file}
                onDelete={handleDelete}
                updateDescription={handleUpdateDescription}
              />
            ) : (
              <FileDisplay key={file.key} file={file} onDelete={handleDelete} />
            )
          )}
        </List>
      </Segment.Group>
    </>
  )
}

export default ApplicationView

const uploadFile = async (
  file: any,
  {
    userId,
    serialNumber,
    applicationResponseId,
    ...fileOptions
  }: {
    userId: number | null
    serialNumber: string
    applicationResponseId?: number
    fileOptions?: any
  }
) => {
  const fileData = new FormData()
  await fileData.append('file', file)
  return await postRequest({
    url: getServerUrl('upload', {
      userId,
      applicationSerial: serialNumber,
      applicationResponseId: applicationResponseId,
      ...fileOptions,
    }),
    otherBody: fileData,
  })
}

const updateFileDescription = async (uniqueId: string, description: string | null) => {
  if (description === '') return
  return await postRequest({
    url: getServerUrl('upload', { uniqueId, description }),
  })
}

const createTextString = (files: FileResponseData[]) =>
  files.reduce(
    (output, file) => output + (output === '' ? file.filename : ', ' + file.filename),
    ''
  )

const generateInitialFileData = (files: FileResponseData[]): FileInfo[] => {
  if (!files) return []
  return files.map((file) => ({
    key: nanoid(10),
    filename: file.filename,
    loading: false,
    error: false,
    errorMessage: null,
    fileData: file,
  }))
}
