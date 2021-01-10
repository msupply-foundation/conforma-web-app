import React, { useState, useEffect } from 'react'
import { Form, Input } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'
import config from '../../../config.json'

// This value must match value in back-end permissions.tsx
const saltRounds = 10 // For bcrypt salting: 2^saltRounds = 1024

const ApplicationView: React.FC<ApplicationViewProps> = ({
  parameters,
  onUpdate,
  value,
  // setValue, -- we don't want to
  setIsActive,
  isEditable,
  currentResponse,
  validationState,
  onSave,
  Markdown,
  validationExpression,
  validationMessage,
}) => {
  const { placeholder, maskedInput, label } = parameters

  const [password, setPassword] = useState(value)
  const [password2, setPassword2] = useState(value)

  // useEffect(() => {
  //   onUpdate(value)
  // }, [])

  function handleChange(e: any) {
    // onUpdate(e.target.value)
    // setValue(e.target.value)
    setPassword(e.target.value)
  }

  async function handleLoseFocus(e: any) {
    const hash = await createHash(password)
    onSave({ hash, customValidation: await customValidate(password) })
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
        value={password ? password : ''}
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
      <Form.Input
        fluid
        placeholder="Repeat password"
        onChange={handleChange}
        onBlur={handleLoseFocus}
        onFocus={setIsActive}
        value={password ? password : ''}
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

const createHash = async (password: string) => {
  try {
    const response = await fetch(config.serverREST + '/create-hash', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    })
    const output = await response.json()
    return output.hash
  } catch (err) {
    throw err
  }
}

// In this case, the validation is not stricly "Custom", but we want
// to localise it to the plugin so we only have to return the hashed
// password to the Wrapper and not the password itself.
const customValidate = async (password: string) => {
  return { isValid: false }
}
