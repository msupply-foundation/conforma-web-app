import React, { useState, useEffect } from 'react'
import { Form } from 'semantic-ui-react'
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
  const [value, setValue] = useState<string>(initialValue?.text)
  const { placeholder, maskedInput, label } = parameters

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
      <label>{label}</label>
      <Form.Input
        fluid
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleLoseFocus}
        value={value ? value : ''}
        disabled={!isEditable}
        type={maskedInput ? 'password' : undefined}
        error={
          !validationState.isValid && currentResponse?.text
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
