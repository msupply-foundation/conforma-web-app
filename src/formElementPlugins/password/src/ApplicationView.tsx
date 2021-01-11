import React, { useState, useEffect } from 'react'
import { Form, Checkbox } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'
import config from '../../../config.json'

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
  isRequired,
  validate,
}) => {
  const {
    placeholder,
    confirmPlaceholder,
    maskedInput,
    label,
    showPasswordToggle,
    validationInternal,
    validationMessageInternal,
  } = parameters

  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [masked, setMasked] = useState(maskedInput === undefined ? true : maskedInput)

  // Reset saved value when re-loading form (since password can't be stored)
  useEffect(() => {
    if (value !== undefined) {
      onSave({ hash: '', text: '', customValidation: { isValid: null } })
    }
  }, [])

  function handleChange(e: any) {
    // onUpdate(e.target.value)
    // setValue(e.target.value)
    if (e.target.name === 'password') setPassword(e.target.value)
    else setPasswordConfirm(e.target.value)
  }

  async function handleLoseFocus(e: any) {
    const responses = { thisResponse: password || '' }
    const customValidation = await validate(validationInternal, validationMessageInternal, {
      objects: { responses },
    })
    const passwordsMatch = password === passwordConfirm
    const hash = customValidation.isValid && passwordsMatch ? await createHash(password) : ''

    onSave({
      hash,
      text: hash !== '' ? '•••••••' : '',
      customValidation,
    })
  }

  console.log('validationState', validationState)

  return (
    <>
      <label>
        <Markdown text={label} semanticComponent="noParagraph" />
      </label>
      <Form.Input
        name="password"
        fluid
        placeholder={placeholder ? placeholder : 'Enter password'}
        onChange={handleChange}
        onBlur={handleLoseFocus}
        onFocus={setIsActive}
        value={password ? password : ''}
        disabled={!isEditable}
        type={masked ? 'password' : undefined}
        error={
          !validationState.isValid && validationState.isValid !== null
            ? {
                content: validationMessageInternal,
                pointing: 'above',
              }
            : null
        }
      />
      <Form.Input
        name="passwordConfirm"
        fluid
        placeholder={confirmPlaceholder ? confirmPlaceholder : 'Confirm password'}
        onChange={handleChange}
        onBlur={handleLoseFocus}
        onFocus={setIsActive}
        value={passwordConfirm ? passwordConfirm : ''}
        disabled={!isEditable}
        type={masked ? 'password' : undefined}
        error={
          passwordConfirm !== password && passwordConfirm !== ''
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
// const customValidate = async (
//   validationExpression: IQueryNode,
//   validationMessage: string,
//   evaluationParams: EvaluatorParameters
// ) => {
//   return await validate(validationExpression, validationMessage, evaluationParams)
// }
