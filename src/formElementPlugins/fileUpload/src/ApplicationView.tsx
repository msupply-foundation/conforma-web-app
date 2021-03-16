import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Button, Form, Icon, Label, Image } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'
import strings from '../constants'
import config from '../../../config.json'
import { Link } from 'react-router-dom'
import { Loading } from '../../../components'

interface FileInfo {
  filename: string
  fileUrl: string
  thumbnailUrl: string
  mimetype: string
}

interface FileLoading {
  filename: string
  loading: boolean
}

interface FileError {
  filename: string
  error: boolean
  errorMessage: string
}

const host = config.serverREST
const uploadEndpoint = '/upload'

const user_id = 1
const application_serial = '7633'
const application_response_id = 1000

const ApplicationView: React.FC<ApplicationViewProps> = ({
  code,
  parameters,
  onUpdate,
  value,
  setValue,
  isEditable,
  // currentResponse,
  validationState,
  onSave,
  Markdown,
  initialValue,
}) => {
  const { label, description, fileCountLimit, fileExtensions, fileSizeLimit } = parameters

  const fileInputRef = useRef<any>(null)

  const [fileData, setFileData] = useState<(FileInfo | FileLoading | FileError)[]>(
    initialValue?.files || []
  )

  useEffect(() => {
    // Only store files that aren't error or loading
    const validFiles = fileData.filter((file) => 'fileUrl' in file)
    onSave({
      text: createTextString(validFiles as FileInfo[]),
      files: validFiles,
    })
  }, [fileData])

  const handleFiles = async (e: any) => {
    const newFileData: any = [...fileData]
    const files: any[] = Array.from(e.target.files)

    for (const file of files) {
      if (newFileData.length >= fileCountLimit) {
        newFileData.push({ filename: file.name, error: true, errorMessage: 'Too many files!' })
        continue
      }
      if (fileData.map((f: any) => f.filename).includes(file.name)) {
        newFileData.push({
          filename: file.name,
          error: true,
          errorMessage: 'File already uploaded',
        })
        continue
      }
      if (file.size > fileSizeLimit * 1000) {
        newFileData.push({
          filename: file.name,
          error: true,
          errorMessage: 'File too big',
        })
        continue
      }
      if (fileExtensions && !fileExtensions.includes(file.name.split('.').pop().toLowerCase())) {
        newFileData.push({
          filename: file.name,
          error: true,
          errorMessage: 'File type not permitted',
        })
        continue
      }
      // Keep the index so we know which array element to update after upload
      file.index = newFileData.push({ filename: file.name, loading: true }) - 1
    }
    setFileData([...newFileData])
    files.forEach(async (file: any) => {
      const result: any = await uploadFile(file)
      if (result.success) {
        newFileData[file.index] = result.fileData[0]
      } else {
        newFileData[file.index] = { filename: file.name, error: true }
      }
      setFileData([...newFileData])
    })
  }

  const handleDelete = async (filename: string) => {
    setFileData(fileData.filter((file) => file.filename !== filename))
  }

  return (
    <>
      <label>
        <Markdown text={label} semanticComponent="noParagraph" />
      </label>
      <Markdown text={description} />
      <div>
        <input
          type="file"
          ref={fileInputRef}
          hidden
          name="file-upload"
          multiple={fileCountLimit > 1}
          onChange={handleFiles}
        />
        <Button primary disabled={!isEditable} onClick={() => fileInputRef?.current?.click()}>
          {fileData.length === 0 ? 'Click to upload' : 'Upload another'}
        </Button>
      </div>
      {fileData.map((file) => {
        if ('error' in file)
          return (
            <Fragment key={file.filename}>
              <Label>{file.filename}</Label>
              <p>{file.errorMessage}</p>
              <p onClick={() => handleDelete(file.filename)}>Delete</p>
            </Fragment>
          )
        if ('loading' in file)
          return (
            <Fragment key={file.filename}>
              <Label>{file.filename}</Label>
              <Loading />
            </Fragment>
          )
        return (
          <Fragment key={file.filename}>
            <Label>
              <a href={host + file.fileUrl} target="_blank">
                {file.filename}
              </a>
            </Label>
            <a href={host + file.fileUrl} target="_blank">
              <Image src={host + file.thumbnailUrl} />
            </a>
            <p onClick={() => handleDelete(file.filename)}>Delete</p>
          </Fragment>
        )
      })}
    </>
  )
}

export default ApplicationView

const uploadFile = async (file: any) => {
  const fileData = new FormData()
  await fileData.append('file', file)
  const response = await fetch(
    `${host}${uploadEndpoint}?user_id=${user_id}&application_serial=${application_serial}&application_response_id=${application_response_id}`,
    { method: 'POST', body: fileData }
  )
  return await response.json()
}

const createTextString = (files: FileInfo[]) =>
  files.reduce(
    (output, file) => output + (output === '' ? file.filename : ', ' + file.filename),
    ''
  )
