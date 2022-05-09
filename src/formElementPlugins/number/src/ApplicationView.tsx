// Number format reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat

import React, { useEffect, useState } from 'react'
import { Form } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'
import { useLanguageProvider } from '../../../contexts/Localisation'

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
  const { getPluginStrings } = useLanguageProvider()
  const strings = getPluginStrings('number')
  const { isEditable } = element
  const {
    placeholder,
    label,
    description,
    default: defaultValue,
    maxWidth,
    type = NumberType.FLOAT,
    simple = true,
    minValue = 0,
    maxValue = Infinity,
    step = 1,
    locale = undefined,
    currency = undefined,
    prefix = '',
    suffix = '',
    maxSignificantDigits = undefined,
  } = parameters
  const [textValue, setTextValue] = useState<string | null | undefined>(currentResponse?.text)
  const [internalValidation, setInternalValidation] = useState(validationState)

  const formatOptions = {
    style: currency ? 'currency' : undefined,
    currency: currency !== '' ? currency : undefined,
    maximumSignificantDigits: maxSignificantDigits,
  }
  const numberFormatter = new Intl.NumberFormat(locale, formatOptions)

  useEffect(() => {
    // Ensures defaultValue is saved on first load
    if (!currentResponse?.text && defaultValue !== undefined) {
      const [number, text] = parseInput(
        String(defaultValue),
        numberFormatter,
        simple,
        prefix,
        suffix
      )
      const validation = customValidate(number, type, minValue, maxValue)
      setInternalValidation(validation)
      if (validation.isValid) onSave({ text, number, type, currency, locale })
      setTextValue(text)
    }
  }, [])

  useEffect(() => {
    if (!textValue) return
    handleLoseFocus()
  }, [locale, minValue, maxValue, currency, prefix, suffix, maxSignificantDigits, type])

  function handleChange(e: any) {
    const text = e.target.value
    const [number, _] = parseInput(text, numberFormatter, simple, prefix, suffix)
    setInternalValidation(customValidate(number, type, minValue, maxValue))
    onUpdate(text)
    setTextValue(text)
  }

  function handleLoseFocus() {
    if (!textValue) return
    const [number, text] = parseInput(textValue, numberFormatter, simple, prefix, suffix)
    const validation = customValidate(number, type, minValue, maxValue)
    setInternalValidation(validation)
    if (validation.isValid) onSave({ text, number, type, currency, locale })
    else onSave(null)
    setTextValue(text)
  }

  const styles = maxWidth
    ? {
        maxWidth,
      }
    : {}

  const customValidate = (
    number: number | null | undefined,
    type: NumberType,
    minValue: number = -Infinity,
    maxValue: number = Infinity
  ): { isValid: boolean; validationMessage?: string } => {
    if (number === NaN || number === null)
      return { isValid: false, validationMessage: strings.ERROR_NOT_NUMBER }
    if (type === NumberType.INTEGER && !Number.isInteger(number))
      return {
        isValid: false,
        validationMessage: strings.ERROR_NOT_INTEGER,
      }
    if ((number as number) < minValue)
      return {
        isValid: false,
        validationMessage: strings.ERROR_TOO_SMALL,
      }
    if ((number as number) > maxValue)
      return {
        isValid: false,
        validationMessage: strings.ERROR_TOO_BIG,
      }
    return { isValid: true }
  }

  return (
    <>
      {label && (
        <label>
          <Markdown text={label} semanticComponent="noParagraph" />
        </label>
      )}
      <Markdown text={description} />
      <Form.Input
        fluid
        type={simple ? 'number' : 'text'}
        min={minValue}
        max={maxValue}
        step={step}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleLoseFocus}
        onClick={handleLoseFocus} // To capture changes via stepper
        onFocus={setIsActive}
        value={textValue ? textValue : ''}
        disabled={!isEditable}
        style={styles}
        error={
          !validationState.isValid || !internalValidation.isValid
            ? {
                content:
                  internalValidation?.validationMessage || validationState?.validationMessage,
                pointing: 'above',
              }
            : null
        }
      />
    </>
  )
}

const parseInput = (
  textInput: string | null | undefined,
  numberFormatter: Intl.NumberFormat,
  simple: boolean,
  prefix: string,
  suffix: string
): [number | null, string | null] => {
  if (!textInput) return [null, null]
  // Strip out any text that isn't a digit, "-" or "." to create the number
  const rawDigits = textInput?.replace(/[^\d\.\-]/g, '')
  if (rawDigits === '') return [null, textInput]
  const number: number = Number(rawDigits)
  const text: string = simple
    ? String(number)
    : ((prefix + numberFormatter.format(number) + suffix) as string)
  return [number, text]
}

export default ApplicationView
