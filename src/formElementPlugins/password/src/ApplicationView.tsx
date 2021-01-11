import React, { useState, useEffect } from 'react'
import { Form, Checkbox } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'
import config from '../../../config.json'

// This value must match value in back-end permissions.tsx
const saltRounds = 10 // For bcrypt salting: 2^saltRounds = 1024

const ApplicationView: React.FC<ApplicationViewProps> = ({
  parameters,
  onUpdate,
  value,
  // setValue,
  setIsActive,
  isEditable,
  currentResponse,
  validationState,
  onSave,
  Markdown,
  validationExpression,
  validationMessage,
  isRequired,
}) => {
  const {
    placeholder,
    maskedInput,
    label,
    showPasswordToggle,
    validationInternal,
    validationMessageInternal,
  } = parameters

  const [password, setPassword] = useState(value)
  const [password2, setPassword2] = useState(value)
  const [masked, setMasked] = useState(maskedInput === undefined ? true : maskedInput)

  // useEffect(() => {
  //   onUpdate(value)
  // }, [])

  function handleChange(e: any) {
    // onUpdate(e.target.value)
    // setValue(e.target.value)
    setPassword(e.target.value)
  }

  function handleChange2(e: any) {
    // onUpdate(e.target.value)
    // setValue(e.target.value)
    setPassword2(e.target.value)
  }

  async function handleLoseFocus(e: any) {
    const hash = await createHash(password)
    const responses = { thisResponse: password || '' }
    // onSave({
    //   hash,
    //   customValidation: await validate(validationExpression, validationMessage, {
    //     objects: { responses },
    //   }),
    // })
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
        type={masked ? 'password' : undefined}
        error={
          !validationState.isValid && password !== undefined
            ? {
                content: validationState?.validationMessage,
                pointing: 'above',
              }
            : null
        }
      />
      <Form.Input
        fluid
        placeholder="Confirm password"
        onChange={handleChange2}
        // onBlur={handleLoseFocus}
        onFocus={setIsActive}
        value={password2 ? password2 : ''}
        disabled={!isEditable}
        type={masked ? 'password' : undefined}
        error={
          password2 !== password && password2 !== undefined
            ? {
                content: 'Passwords do not match',
                pointing: 'above',
              }
            : null
        }
      />
      {(showPasswordToggle === undefined ? true : showPasswordToggle) && (
        <Checkbox label="Show password" checked={!masked} onClick={() => setMasked(!masked)} />
      )}
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
// const customValidate = async (password: string) => {
//   return { isValid: false }
// }
