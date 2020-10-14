import React, { useState } from 'react'
import { Form } from 'semantic-ui-react'
import { ApplicatioViewProps } from '../../types'

const ApplicationView: React.FC<ApplicatioViewProps> = ({ templateElement, onUpdate, initialValue, isEditable }) => {
  const [validationMessage, setValidationMessage] = useState('')
  const [value, setValue] = useState(initialValue)

  return (
    <Form.Input
      fluid
      label={templateElement.title}
      placeholder={templateElement.parameters.placeholder}
      onChange={onChange(setValue, setValidationMessage, onUpdate)}
      value={value}
      disabled={!isEditable}
      error={
        validationMessage
          ? {
              content: validationMessage,
              pointing: 'above',
            }
          : null
      }
    />
  )
}

function onChange(updateValue: any, updateValidationMessage: any, onUpdate: any) {
  return (_: any, { value }: any) => {
    updateValue(value)
    // Validation here is just an example.
    // ideally we use validation condition from templateElement and query evaluator
    if (value.match(/^[a-zA-Z ]*$/) == null) {
      updateValidationMessage('Should only have letters and space')
      onUpdate({ isValid: false })
    } else {
      updateValidationMessage('')
      onUpdate({ value: value, isValid: true })
    }
  }
}

export default ApplicationView
