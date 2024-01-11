import { JsonEditorProps } from 'json-edit-react'
import React, { useState } from 'react'
import { JsonEditor } from '../../../components/Admin/JsonEditor'
import { ApplicationViewProps } from '../../types'

import useDefault from '../../useDefault'

interface FilterConfig {}

interface Parameters extends Omit<JsonEditorProps, 'data'> {
  label?: string
  description?: string
  maxWidth?: number
  default?: Record<string, any>
  overflow?: boolean
  preventEditFields?: string[]
  allowEditDepth?: number
  allowAddDepth?: number
  allowDeleteDepth?: number
  canChangeType?: boolean
}

const ApplicationView: React.FC<ApplicationViewProps> = ({
  element,
  parameters,
  onUpdate,
  setIsActive,
  currentResponse,
  validationState,
  onSave,
  Markdown,
}) => {
  const [value, setValue] = useState<Record<string, any>>(currentResponse?.data ?? {})

  const { isEditable } = element
  const {
    label,
    description,
    maxWidth,
    default: defaultValue,
    collapse = 1,
    ...jsonProps
  } = parameters as Parameters

  useDefault({
    defaultValue,
    currentResponse,
    parameters,
    onChange: (data: Record<string, any>) => {
      setValue(data)
      onSave({ text: JSON.stringify(data), data })
    },
  })

  console.log('value', value)

  // const styles = maxWidth
  //   ? {
  //       maxWidth,
  //     }
  //   : {}

  const jsonEditProps = {
    collapse,
    ...jsonProps,
  }

  return (
    <>
      {label && (
        <label>
          <Markdown text={label} semanticComponent="noParagraph" />
        </label>
      )}
      <Markdown text={description} />
      <JsonEditor
        data={value}
        onSave={(data) => {
          onSave({ text: JSON.stringify(data), data })
        }}
        showSaveButton={false}
        {...jsonEditProps}
      />
    </>
  )
}

export default ApplicationView
