import React, { useEffect } from 'react'
import { Dropdown, Header } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'

const ApplicationView: React.FC<ApplicationViewProps> = ({
  parameters,
  onUpdate,
  value,
  setValue,
  isEditable,
  currentResponse,
  validationState,
  onSave,
}) => {
  const { label, description, placeholder, options, default: defaultIndex } = parameters

  useEffect(() => {
    onUpdate(value)
    if (!value && defaultIndex !== undefined)
      onSave({ text: value, optionIndex: options.indexOf(value) })
  }, [])

  function handleChange(e: any, data: any) {
    const { value } = data
    setValue(value)
    onSave({ text: value, optionIndex: options.indexOf(value) })
  }

  const dropdownOptions = options.map((option: any, index: number) => {
    return {
      key: option,
      text: option,
      value: option,
      index,
    }
  })

  return (
    <>
      <Header content={label} />
      {description}
      <Dropdown
        fluid
        selection
        placeholder={placeholder}
        options={dropdownOptions}
        onChange={handleChange}
        value={value || options[defaultIndex]}
        disabled={!isEditable}
      />
    </>
  )
}

export default ApplicationView
