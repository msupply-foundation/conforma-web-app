import React, { useState, useEffect } from 'react'
import { Form } from 'semantic-ui-react'
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
  const { placeholder, maskedInput, label } = templateElement?.parameters

  // console.log('validationState', validationState)

  useEffect(() => {
    onUpdate(value)
  }, [])

  function handleChange(e: any) {
    onUpdate(e.target.value)
    setValue(e.target.value)
  }

  function handleLoseFocus(e: any) {
    // TO-DO if password (i.e 'maskedInput'), do HASH on password before sending value
    onSave({ text: value })
  }

  return (
    <>
      <Form.Input
        fluid
        label={label}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleLoseFocus}
        value={value}
        disabled={!isEditable}
        type={maskedInput ? 'password' : undefined}
        error={
          !validationState.isValid && currentResponse?.value?.text
            ? {
                content: validationState?.validationMessage,
                pointing: 'above',
              }
            : null
        }
      />
    </>
  )
}

export default ApplicationView
