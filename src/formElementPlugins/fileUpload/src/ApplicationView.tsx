import React, { useEffect, useState, useRef } from 'react'
import {
  Button,
  Form,
  Icon,
  Grid,
  Card,
  List,
  Label,
  Image,
  Segment,
  Loader,
} from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'
import strings from '../constants'
import config from '../../../config.json'
import { Link } from 'react-router-dom'
import { Loading } from '../../../components'
import { useUserState } from '../../../contexts/UserState'
import { useRouter } from '../../../utils/hooks/useRouter'

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
const { uploadEndpoint } = config

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

  // These values required for file upload query parameters:
  const {
    userState: { currentUser },
  } = useUserState()
  const {
    query: { serialNumber },
  } = useRouter()
  const application_response_id = initialValue.id

  const [fileData, setFileData] = useState<(FileInfo | FileLoading | FileError)[]>(
    initialValue?.files || []
  )
  const fileInputRef = useRef<any>(null)

  useEffect(() => {
    console.log('Files', fileData)
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
        newFileData.unshift({ filename: file.name, error: true, errorMessage: 'Too many files!' })
        continue
      }
      if (fileData.map((f: any) => f.filename).includes(file.name)) {
        newFileData.unshift({
          filename: file.name,
          error: true,
          errorMessage: 'File already uploaded',
        })
        continue
      }
      if (file.size > fileSizeLimit * 1000) {
        newFileData.unshift({
          filename: file.name,
          error: true,
          errorMessage: 'File too big',
        })
        continue
      }
      if (fileExtensions && !fileExtensions.includes(file.name.split('.').pop().toLowerCase())) {
        newFileData.unshift({
          filename: file.name,
          error: true,
          errorMessage: 'File type not permitted',
        })
        continue
      }
      newFileData.push({ filename: file.name, loading: true })
    }
    setFileData([...newFileData])
    files.forEach(async (file: any) => {
      if ('error' in file) return
      const result: any = await uploadFile(file)
      const index = newFileData.findIndex((f: any) => f.filename === file.name)
      if (result.success) {
        newFileData[index] = result.fileData[0]
      } else {
        newFileData[index] = { filename: file.name, error: true }
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
      <Segment.Group>
        <input
          type="file"
          ref={fileInputRef}
          hidden
          name="file-upload"
          multiple={fileCountLimit > 1}
          onChange={handleFiles}
        />
        <Segment basic textAlign="center">
          <Button primary disabled={!isEditable} onClick={() => fileInputRef?.current?.click()}>
            <Icon name="upload" />
            {fileData.length === 0 ? 'Click to upload' : 'Upload another'}
          </Button>
        </Segment>
        <List horizontal verticalAlign="top">
          {fileData.map((file) => {
            if ('error' in file)
              return (
                <Card>
                  <List.Item key={file.filename}>
                    <Label>{file.errorMessage}</Label>
                    <List.Content>
                      {file.filename}
                      <br />
                      <a onClick={() => handleDelete(file.filename)}>Delete</a>
                    </List.Content>
                  </List.Item>
                </Card>
              )
            if ('loading' in file)
              return (
                <List.Item key={file.filename} style={{ maxWidth: 200 }}>
                  <Grid verticalAlign="top" celled style={{ boxShadow: 'none' }}>
                    <Grid.Row style={{ boxShadow: 'none', marginLeft: 150 }} verticalAlign="bottom">
                      <Icon
                        link
                        name="delete"
                        circular
                        fitted
                        color="grey"
                        onClick={() => handleDelete(file.filename)}
                      />
                    </Grid.Row>
                    <Grid.Row
                      centered
                      style={{ boxShadow: 'none', height: 120 }}
                      verticalAlign="middle"
                    >
                      <Loader active size="medium">
                        Uploading
                      </Loader>
                    </Grid.Row>
                    <Grid.Row centered style={{ boxShadow: 'none' }}>
                      <p style={{ wordBreak: 'break-word' }}>{file.filename}</p>
                    </Grid.Row>
                  </Grid>
                </List.Item>
              )
            return (
              <List.Item key={file.filename} style={{ maxWidth: 200 }}>
                <Grid verticalAlign="top" celled style={{ boxShadow: 'none' }}>
                  <Grid.Row style={{ boxShadow: 'none', marginLeft: 150 }} verticalAlign="bottom">
                    <Icon
                      link
                      name="delete"
                      circular
                      fitted
                      color="grey"
                      onClick={() => handleDelete(file.filename)}
                    />
                  </Grid.Row>
                  <Grid.Row centered style={{ boxShadow: 'none' }} verticalAlign="top">
                    <a href={host + file.fileUrl} target="_blank">
                      <Image
                        src={host + file.thumbnailUrl}
                        style={{ maxHeight: '120px' }}
                        // onMouseOver={() => console.log('Hovering')}
                      />
                    </a>
                  </Grid.Row>
                  <Grid.Row centered style={{ boxShadow: 'none' }}>
                    <p style={{ wordBreak: 'break-word' }}>
                      <a href={host + file.fileUrl} target="_blank">
                        {file.filename}
                      </a>{' '}
                      <a onClick={() => handleDelete(file.filename)}>Delete</a>
                    </p>
                  </Grid.Row>
                </Grid>
              </List.Item>
            )
          })}
        </List>
      </Segment.Group>
    </>
  )
  async function uploadFile(file: any) {
    const fileData = new FormData()
    await fileData.append('file', file)
    const response = await fetch(
      `${host}${uploadEndpoint}?user_id=${currentUser?.userId}&application_serial=${serialNumber}&application_response_id=${application_response_id}`,
      { method: 'POST', body: fileData }
    )
    return await response.json()
  }
}

export default ApplicationView

const createTextString = (files: FileInfo[]) =>
  files.reduce(
    (output, file) => output + (output === '' ? file.filename : ', ' + file.filename),
    ''
  )
