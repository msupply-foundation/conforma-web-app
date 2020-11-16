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
  const [validationMessageDisplay, setValidationMessage] = useState('')
  const [value, setValue] = useState(initialValue?.text)
  const [isValid, setIsValid] = useState<boolean>()
  const { validation: validationExpression, validationMessage } = templateElement?.parameters

  // console.log('validationExpression', validationExpression)
  // console.log('validationMessage', validationMessage)

  // const thisQuestionValue = allResponses[]

  useEffect(() => {
    // Do validation, setIsValid
    if (validationExpression) {
      console.log('Expression', validationExpression)
      const expression = { operator: '=', children: [2, 2] }
      evaluator(validationExpression, { objects: [allResponses] }).then((result: boolean) => {
        console.log('result', result)
        setIsValid(result)
      })
    } else setIsValid(true)
  }, [value])

  function handleChange(e: any) {
    setValue(e.target.value)
  }

  function handleLoseFocus(e: any) {
    if (isValid) onUpdate({ value: e.target.value, isValid: true }) // Re-do for proper response shape
    onUpdate({ value: e.target.value, isValid: true })
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

// function onChange(updateValue: any, updateValidationMessage: any) {
//   return (_: any, { value }: any) => {
//     updateValue(value)
// Validation here is just an example.
// ideally we use validation condition from templateElement and query evaluator
// if (value.match(/^[a-zA-Z ]*$/) == null) {
//   updateValidationMessage('Should only have letters and space')
//   onUpdate({ isValid: false })
// } else {
//   updateValidationMessage('')
//   onUpdate({ value: value, isValid: true })
// }
//   }
// }

export default ApplicationView
