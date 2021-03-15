import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Button, Form, Label, Image } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'
import strings from '../constants'
import config from '../../../config.json'
import { Link } from 'react-router-dom'

interface FileInfo {
  filename: string
  fileUrl: string
  thumbnailUrl: string
  mimetype: string
}

const host = config.serverREST

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

  // getImage('/file?uid=qsHimW1hrZ7YAxlcN4h8M&thumbnail=true').then((result) =>
  //   console.log('result', result)
  // )

  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>(initialValue?.files || [])

  // console.log('uploadedFiles', uploadedFiles)
  // console.log('initialValue', initialValue)

  // useEffect(() => {
  //   onSave({
  //     text: createTextString(uploadedFiles as FileInfo[]),
  //     values: uploadedFiles,
  //   })
  // }, [uploadedFiles])

  const onChangeHandler = (e: any) => {
    console.log(e.target.files)
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
          onChange={onChangeHandler}
        />
        <Button primary onClick={() => fileInputRef?.current?.click()}>
          Click to upload
        </Button>
      </div>
      {uploadedFiles.map((file) => {
        console.log(file.filename)
        return (
          <Fragment key={file.filename}>
            <Label>
              <a href={host + file.fileUrl} target="_blank">
                {file.filename}
              </a>
            </Label>
            <a href={host + file.fileUrl} target="_blank">
              <Image src={host + file.thumbnailUrl}></Image>
            </a>
          </Fragment>
        )
      })}
    </>
  )
}

export default ApplicationView

const getInitialState = (initialValue: any, checkboxes: FileInfo[]) => {
  // Returns a consistent array of Checkbox objects, regardless of input structure
  // const { values: initValues } = initialValue
  // return (
  //   checkboxes
  //     .map((cb: Checkbox, index: number) => {
  //       if (typeof cb === 'string' || typeof cb === 'number')
  //         return { label: String(cb), text: String(cb), key: index, selected: false }
  //       else
  //         return {
  //           label: cb.label,
  //           text: cb?.text || cb.label,
  //           key: cb?.key || index,
  //           selected: cb?.selected || false,
  //         }
  //     })
  //     // Replaces with any already-selected values from database
  //     .map((cb) => ({
  //       ...cb,
  //       selected: initValues?.[cb.key] ? initValues[cb.key].selected : cb.selected,
  //     }))
  // )
  return []
}

const createTextString = (files: FileInfo[]) =>
  // files
  //   .reduce((output, file) => {
  //     return output + (output === '' ? file.text : ', ' + file.text)
  //   }, '')
  //   .replace(/^$/, `*<${strings.LABEL_SUMMMARY_NOTHING_SELECTED}>*`)
  'Some text here'
