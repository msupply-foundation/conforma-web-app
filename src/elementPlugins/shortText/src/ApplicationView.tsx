import React, { useState, useEffect } from 'react'
import { Form } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'

const ApplicationView: React.FC<ApplicationViewProps> = ({
  code,
  onUpdate,
  initialValue,
  isEditable,
  isRequired,
  parameters,
  allResponses,
  evaluator,
}) => {
  const [validationMessageDisplay, setValidationMessageDisplay] = useState('')
  const [value, setValue] = useState(initialValue?.text)
  const [isValid, setIsValid] = useState<boolean>()
  const [responses, setResponses] = useState({
    thisResponse: undefined,
    ...allResponses,
  })
  const {
    validation: validationExpression,
    validationMessage,
    placeholder,
    maskedInput,
    label,
  } = parameters

  useEffect(() => {
    // Do validation, setIsValid
    if (validationExpression && responses.thisResponse !== undefined) {
      evaluator(validationExpression, { objects: [responses], APIfetch: fetch })
        .then((result: boolean) => {
          setIsValid(result)
        })
        .catch((err: any) => console.log(err))
    } else setIsValid(true)
  }, [responses])

  useEffect(() => {
    setResponses({ thisResponse: value, ...allResponses })
  }, [value])

  useEffect(() => {
    if (isValid) setValidationMessageDisplay('')
    else setValidationMessageDisplay(validationMessage)
  }, [isValid])

  function handleChange(e: any) {
    setValue(e.target.value)
  }

  function handleLoseFocus(e: any) {
    // TO-DO if password (i.e 'maskedInput'), do HASH on password before sending value
    onUpdate({ value: { text: value }, isValid })
  }

  return (
    <>
      <Form.Input
        fluid
        label={label}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleLoseFocus}
        value={value ? value : ''}
        disabled={!isEditable}
        type={maskedInput ? 'password' : undefined}
        error={
          !isValid && allResponses[code]
            ? {
                content: validationMessageDisplay,
                pointing: 'above',
              }
            : null
        }
      />
    </>
  )
}

export default ApplicationView
