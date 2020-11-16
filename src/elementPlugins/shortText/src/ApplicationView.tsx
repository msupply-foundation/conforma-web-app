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
  const { validation: validationExpression, validationMessage } = templateElement?.parameters

  useEffect(() => {
    // Do validation, setIsValid
    if (validationExpression && responses.thisResponse !== undefined) {
      evaluator(validationExpression, { objects: [responses] }).then((result: boolean) => {
        console.log('result', result)
        setIsValid(result)
      })
    } else setIsValid(true)
  }, [responses])

  useEffect(() => {
    setResponses({ thisResponse: value, ...allResponses })
    console.log('responses', responses)
  }, [value])

  useEffect(() => {
    if (isValid) {
      setValidationMessageDisplay('')
    } else setValidationMessageDisplay(validationMessage)
  }, [isValid])

  function handleChange(e: any) {
    setValue(e.target.value)
  }

  function handleLoseFocus(e: any) {
    if (isValid) {
      onUpdate({ value: e.target.value, isValid: true }) // Re-do for proper response shape
    } else {
      onUpdate({ isValid: false })
    }
  }

  return (
    <Form.Input
      fluid
      label={templateElement.title}
      placeholder={templateElement.parameters.placeholder}
      // onChange={onChange(setValue, setValidationMessage, onUpdate)}
      onChange={handleChange}
      onBlur={handleLoseFocus}
      value={value}
      disabled={!isEditable}
      error={
        validationMessageDisplay
          ? {
              content: validationMessageDisplay,
              pointing: 'above',
            }
          : null
      }
    />
  )
}

export default ApplicationView
