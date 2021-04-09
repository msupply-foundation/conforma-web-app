import React, { useState, useEffect } from 'react'
import { Form, Input } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'

const ApplicationView: React.FC<ApplicationViewProps> = ({
  element,
  parameters,
  onUpdate,
  value,
  setValue,
  setIsActive,
  currentResponse,
  validationState,
  onSave,
  Markdown,
}) => {
  const { label, description, placeholder, rows } = parameters

  const { isEditable } = element

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
      <Markdown text={description} />
      <Form.TextArea
        fluid
        placeholder={placeholder}
        rows={rows || 5}
        onChange={handleChange}
        onBlur={handleLoseFocus}
        onFocus={setIsActive}
        value={value ? value : ''}
        disabled={!isEditable}
        error={
          !validationState.isValid
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
