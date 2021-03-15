import React, { Fragment, useEffect, useState } from 'react'
import { Button, Form, Label, Image } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'
import { getImage } from '../../../utils/helpers/fetchMethods'
import strings from '../constants'

interface FileInfo {
  filename: string
  mimetype: string
  fileUrl: string | number
  thumbnailUrl: boolean
}

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

  getImage('/file?uid=qsHimW1hrZ7YAxlcN4h8M&thumbnail=true').then((result) =>
    console.log('result', result)
  )

  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>(initialValue.files)

  console.log('uploadedFiles', uploadedFiles)
  // console.log('initialValue', initialValue)

  // useEffect(() => {
  //   onSave({
  //     text: createTextString(uploadedFiles as FileInfo[]),
  //     values: uploadedFiles,
  //   })
  // }, [uploadedFiles])

  return (
    <>
      <label>
        <Markdown text={label} semanticComponent="noParagraph" />
      </label>
      <Markdown text={description} />
      <Button primary>Click to upload</Button>
      {uploadedFiles.map((file) => {
        console.log(file.filename)
        return (
          <Fragment key={file.filename}>
            <Label>{file.filename}</Label>
            <Image src={getImage(file.filename)}></Image>
          </Fragment>
        )
      })}
      {/* {checkboxElements.map((cb: Checkbox, index: number) => {
        return layout === 'inline' ? (
          <Checkbox
            label={cb.label}
            checked={cb.selected}
            onChange={toggle}
            index={index}
            toggle={type === 'toggle'}
            slider={type === 'slider'}
          />
        ) : (
          <Form.Field key={`${index}_${cb.label}`} disabled={!isEditable}>
            <Checkbox
              label={cb.label}
              checked={cb.selected}
              onChange={toggle}
              index={index}
              toggle={type === 'toggle'}
              slider={type === 'slider'}
            />
          </Form.Field>
        )
      })} */}
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
