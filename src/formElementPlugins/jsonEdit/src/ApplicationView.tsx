import { FilterFunction, JsonData, JsonEditorProps } from 'json-edit-react'
import React, { useState } from 'react'
import { ApplicationViewProps } from '../../types'
import { useViewport } from '../../../contexts/ViewportState'

import useDefault from '../../useDefault'

const JsonEditor = React.lazy(() => import('../../../components/Admin/JsonEditor/JsonEditor'))

export interface Parameters extends Omit<JsonEditorProps, 'data' | 'setData'> {
  label?: string
  description?: string
  default?: Record<string, any>
  width?: number
  preventEditFields?: string[]
  allowEditDepth?: number
  allowAddDepth?: number
  allowDeleteDepth?: number
  canChangeType?: boolean
  showSearch?: boolean
  searchPlaceholder?: string
}

const ApplicationView: React.FC<ApplicationViewProps> = ({
  element,
  parameters,
  currentResponse,
  onSave,
  Markdown,
}) => {
  const [value, setValue] = useState(currentResponse?.data ?? {})
  const { viewport } = useViewport()

  const { isEditable } = element
  const {
    label,
    description,
    default: defaultValue,
    width,
    preventEditFields,
    allowEditDepth,
    allowAddDepth = allowEditDepth,
    allowDeleteDepth = allowEditDepth,
    collapse = 1,
    canChangeType = false,
    showSearch = false,
    searchPlaceholder,
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

  const handleChange = (data: JsonData) => {
    setValue(value)
    onSave({ text: JSON.stringify(data), data })
  }

  const allowEdit = getPermissionFunction(isEditable, allowEditDepth, preventEditFields)
  const allowAdd = getPermissionFunction(isEditable, allowAddDepth, preventEditFields)
  const allowDelete = getPermissionFunction(isEditable, allowDeleteDepth, preventEditFields)
  const allowTypeSelection = canChangeType
    ? true
    : // If type can't be changed, we still allow changing a null value
      ({ value }: any) => (value === null ? true : [])

  const jsonEditProps = {
    collapse,
    allowEdit,
    allowAdd,
    allowDelete,
    allowTypeSelection,
    ...jsonProps,
  }

  const widthProps = width ? { theme: { container: { width: `${width}px` } } } : {}

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
        onSave={handleChange}
        showSaveButton={false}
        {...jsonEditProps}
        maxWidth={viewport.width - 70}
        {...widthProps}
        showSearch={showSearch}
        searchPlaceholder={searchPlaceholder}
      />
    </>
  )
}

export default ApplicationView

const getPermissionFunction = (
  isEditable: boolean,
  depth: number = 0,
  preventFields: (string | number)[] = []
): FilterFunction | boolean => {
  if (!isEditable) return false

  return ({ key, level }) => !(preventFields.includes(key) || level < depth)
}
