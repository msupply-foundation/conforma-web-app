import React, { useState, useEffect } from 'react'
import { Form } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'

const ApplicationView: React.FC<ApplicationViewProps> = ({
  templateElement,
  onUpdate,
  initialValue,
  isEditable,
  isRequired,
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
  } = templateElement?.parameters

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
    onUpdate({ value: { text: e.target.value }, isValid })
  }

  return (
    <>
      <Form.Input
        fluid
        label={templateElement.title}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleLoseFocus}
        value={value}
        disabled={!isEditable}
        type={maskedInput ? 'password' : undefined}
        error={
          !isValid && allResponses[templateElement.code]
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
