import React, { useState, useEffect } from 'react'
import { Dropdown, Header, Message } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'

const ApplicationView: React.FC<ApplicationViewProps> = ({
  templateElement,
  onUpdate,
  initialValue,
  isEditable,
  currentResponse,
  validationState,
  onSave,
}) => {
  const [value, setValue] = useState(initialValue?.text)
  const {
    label,
    description,
    placeholder,
    options,
    default: defaultIndex,
  } = templateElement?.parameters

  useEffect(() => {
    onUpdate(value)
  }, [])

  function handleChange(e: any, data: any) {
    const { value } = data
    onUpdate(value)
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
        defaultValue={options[defaultIndex]}
        placeholder={placeholder}
        options={dropdownOptions}
        onChange={handleChange}
        // onBlur={handleLoseFocus}
        value={value}
        disabled={!isEditable}
      />
    </>
  )
}

export default ApplicationView
