import React, { useEffect } from 'react'
import { Dropdown, Label } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'

const ApplicationView: React.FC<ApplicationViewProps> = ({
  element,
  parameters,
  onUpdate,
  value,
  setValue,
  validationState,
  onSave,
  Markdown,
  getDefaultIndex,
}) => {
  const { isEditable } = element
  const { label, description, placeholder, search, options, default: defaultOption } = parameters

  useEffect(() => {
    onUpdate(value)
    // This ensures that, if a default is specified, it gets saved on first load
    if (!value && defaultOption !== undefined) {
      const defaultIndex = getDefaultIndex(defaultOption, options)
      const defaultValue = options?.[defaultIndex]
      onSave({
        text: defaultValue,
        optionIndex: defaultIndex,
      })
      setValue(defaultValue)
    }
  }, [])

  function handleChange(e: any, data: any) {
    const { value } = data
    setValue(value)
    onSave({ text: value, optionIndex: options.indexOf(value) })
  }

  const dropdownOptions = options.map((option: any, index: number) => {
    return {
      key: `${index}_${option}`,
      text: option,
      value: option,
      index,
    }
  })

  return (
    <>
      <label>
        <Markdown text={label} semanticComponent="noParagraph" />
      </label>
      <Markdown text={description} />
      <Dropdown
        fluid
        selection
        search={search}
        placeholder={placeholder}
        options={dropdownOptions}
        onChange={handleChange}
        value={value}
        disabled={!isEditable}
        error={!validationState.isValid ? true : undefined}
      />
      {validationState.isValid ? null : (
        <Label basic color="red" pointing>
          {validationState?.validationMessage}
        </Label>
      )}
    </>
  )
}

export default ApplicationView
