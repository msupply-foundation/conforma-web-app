import React, { useState, useEffect } from 'react'
import { Form, Input } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'

const ApplicationView: React.FC<ApplicationViewProps> = ({
  parameters,
  onUpdate,
  value,
  setValue,
  setIsActive,
  isEditable,
  currentResponse,
  validationState,
  onSave,
  Markdown,
}) => {
  const { placeholder, maskedInput, label } = parameters

  useEffect(() => {
    onUpdate(value)
  }, [])

  function handleChange(e: any) {
    onUpdate(e.target.value)
    setValue(e.target.value)
  }

  function handleLoseFocus(e: any) {
    onSave({ text: value })
  }

  return (
    <>
      <label>
        <Markdown text={label} semanticComponent="noParagraph" />
      </label>
      <Form.Input
        fluid
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleLoseFocus}
        onFocus={setIsActive}
        value={value ? value : ''}
        disabled={!isEditable}
        type={maskedInput ? 'password' : undefined}
        error={
          !validationState.isValid && currentResponse?.text !== undefined
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
