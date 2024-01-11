import { FilterFunction, JsonEditorProps } from 'json-edit-react'
import React, { useState } from 'react'
import { JsonEditor } from '../../../components/Admin/JsonEditor'
import { ApplicationViewProps } from '../../types'

import useDefault from '../../useDefault'

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
  currentResponse,
  onSave,
  Markdown,
}) => {
  const [value, setValue] = useState(currentResponse?.data ?? {})

  const { isEditable } = element
  const {
    label,
    description,
    maxWidth,
    default: defaultValue,
    overflow,
    preventEditFields,
    allowEditDepth,
    allowAddDepth = allowEditDepth,
    allowDeleteDepth = allowEditDepth,
    collapse = 1,
    canChangeType = false,
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

  const handleChange = (data: Record<string, any>) => {
    setValue(value)
    onSave({ text: JSON.stringify(data), data })
  }

  // const styles = maxWidth
  //   ? {
  //       maxWidth,
  //     }
  //   : {}

  const restrictEdit = getRestrictionFunction(isEditable, allowEditDepth, preventEditFields)
  const restrictAdd = getRestrictionFunction(isEditable, allowAddDepth, preventEditFields)
  const restrictDelete = getRestrictionFunction(isEditable, allowDeleteDepth, preventEditFields)
  const restrictTypeSelection = canChangeType
    ? false
    : // If type can't be changed, we still allow changing a null value
      ({ value }: any) => (value === null ? false : [])

  const jsonEditProps = {
    collapse,
    restrictEdit,
    restrictAdd,
    restrictDelete,
    restrictTypeSelection,
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
      <JsonEditor data={value} onSave={handleChange} showSaveButton={false} {...jsonEditProps} />
    </>
  )
}

export default ApplicationView

const getRestrictionFunction = (
  isEditable: boolean,
  depth: number = 0,
  preventFields: (string | number)[] = []
): FilterFunction | boolean => {
  if (!isEditable) return true

  return ({ key, level }) => preventFields.includes(key) || level < depth
}
