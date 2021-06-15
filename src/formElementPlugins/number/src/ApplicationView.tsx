import React, { useEffect, useState } from 'react'
import { Form } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'

export enum NumberType {
  INTEGER = 'integer',
  FLOAT = 'float',
}

const ApplicationView: React.FC<ApplicationViewProps> = ({
  element,
  parameters,
  onUpdate,
  setIsActive,
  validationState,
  onSave,
  Markdown,
  currentResponse,
}) => {
  const [textValue, setTextValue] = useState<string | null | undefined>(currentResponse?.text)
  const [internalValidation, setInternalValidation] = useState(validationState)
  const { isEditable } = element
  const {
    placeholder,
    label,
    description,
    maxWidth,
    type = NumberType.FLOAT,
    minValue = -Infinity,
    maxValue = Infinity,
    locale = undefined,
    currency = undefined,
    prefix = '',
    suffix = '',
    maxSignificantDigits = undefined,
  } = parameters

  const formatOptions = {
    style: currency ? 'currency' : undefined,
    currency: currency ?? undefined,
    maximumSignificantDigits: maxSignificantDigits,
  }
  const numberFormatter = new Intl.NumberFormat(locale, formatOptions)

  useEffect(() => {
    console.log(internalValidation, validationState)
  }, [internalValidation, validationState])

  function handleChange(e: any) {
    const text = e.target.value
    const [number, _] = parseInput(textValue, numberFormatter)
    onUpdate(text)
    if (type === NumberType.INTEGER) {
      if (Number.isInteger(number))
        setInternalValidation({
          isValid: true,
          validationMessage: '',
        })
      else
        setInternalValidation({
          isValid: false,
          validationMessage: 'Number must be an integer',
        })
    }
    setTextValue(text)
  }

  function handleLoseFocus(e: any) {
    const [number, newText] = parseInput(textValue, numberFormatter)
    onSave({ text: newText, number, customValidation: internalValidation })
    setTextValue(newText)
  }

  const styles = maxWidth
    ? {
        maxWidth,
      }
    : {}

  return (
    <>
      <label>
        <Markdown text={label} semanticComponent="noParagraph" />
      </label>
      <Markdown text={description} />
      <Form.Input
        fluid
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleLoseFocus}
        onFocus={setIsActive}
        value={textValue ? textValue : ''}
        disabled={!isEditable}
        style={styles}
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

const parseInput = (textInput: string | null | undefined, numberFormatter: any) => {
  if (textInput === '') return [null, null]
  let number: number = Number(textInput?.replace(/[^\d\.]/g, ''))
  console.log(number)
  return [number, numberFormatter.format(number)]
}

export default ApplicationView
