import React, { useState, useEffect } from 'react'
import { Dropdown, Header, Message } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'

const ApplicationView: React.FC<ApplicationViewProps> = ({
  parameters,
  onUpdate,
  initialValue,
  isEditable,
  currentResponse,
  validationState,
  onSave,
}) => {
  const { label, description, placeholder, options, default: defaultIndex } = parameters

  const [value, setValue] = useState(initialValue?.text || options[defaultIndex])

  useEffect(() => {
    onUpdate(value)
    if (!initialValue && defaultIndex !== undefined)
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
        value={value}
        disabled={!isEditable}
      />
    </>
  )
}

export default ApplicationView
