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
    type = NumberType.INTEGER,
    simple = true,
    minValue = 0,
    maxValue = Infinity,
    step = 1,
    locale,
    currency,
    prefix,
    suffix,
    suffixPlural = suffix,
    maxSignificantDigits,
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
      const { number, formattedNumber, fullText } = parseInput(
        String(defaultValue),
        numberFormatter,
        simple,
        prefix,
        suffix,
        suffixPlural
      )
      const validation = customValidate(number, type, minValue, maxValue)
      setInternalValidation(validation)
      if (validation.isValid) onSave({ text: fullText, number, type, currency, locale })
      setTextValue(formattedNumber)
    }
  }, [])

  useEffect(() => {
    if (!textValue) return
    handleLoseFocus()
  }, [locale, minValue, maxValue, currency, prefix, suffix, maxSignificantDigits, type])

  function handleChange(e: any) {
    const text = e.target.value
    const { number } = parseInput(text, numberFormatter, simple, prefix, suffix, suffixPlural)
    setInternalValidation(customValidate(number, type, minValue, maxValue))
    onUpdate(text)
    setTextValue(text)
  }

  function handleLoseFocus() {
    if (!textValue) return
    const { number, formattedNumber, fullText } = parseInput(
      textValue,
      numberFormatter,
      simple,
      prefix,
      suffix,
      suffixPlural
    )
    const validation = customValidate(number, type, minValue, maxValue)
    setInternalValidation(validation)
    if (validation.isValid)
      onSave({
        text: fullText,
        number,
        type,
        currency,
        locale,
        prefix,
        suffix,
        suffixPlural,
      })
    else onSave(null)
    setTextValue(formattedNumber)
  }

  const styles = maxWidth
    ? {
        maxWidth,
      }
    : prefix || suffix
    ? { maxWidth: 100 }
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
      <div className="flex-row-start-center" style={{ gap: 5 }}>
        {prefix && <span>{prefix}</span>}
        <div style={{ flexGrow: 1, ...styles }}>
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
        </div>
        {suffix && (
          <span>
            {
              parseInput(textValue, numberFormatter, simple, prefix, suffix, suffixPlural)
                .currentSuffix
            }
          </span>
        )}
      </div>
    </>
  )
}

const parseInput = (
  textInput: string | null | undefined,
  numberFormatter: Intl.NumberFormat,
  simple: boolean,
  prefix: string | undefined,
  suffix: string | undefined,
  suffixPlural: string | undefined
): {
  number: number | null
  formattedNumber: string | null
  currentSuffix: string | undefined
  fullText: string | null
} => {
  if (!textInput)
    return { number: null, formattedNumber: null, currentSuffix: suffixPlural, fullText: null }
  // Strip out any text that isn't a digit, "-" or "." to create the number
  const rawDigits = textInput?.replace(/[^\d\.\-]/g, '')
  if (rawDigits === '')
    return { number: null, formattedNumber: textInput, currentSuffix: suffixPlural, fullText: null }
  const number: number = Number(rawDigits)
  const prefixString = prefix ? prefix + ' ' : ''
  const suffixString = suffix ? ' ' + (number === 1 ? suffix : suffixPlural) : ''
  const text: string = simple ? String(number) : (numberFormatter.format(number) as string)
  const fullText = prefixString + text + suffixString
  return {
    number,
    formattedNumber: text,
    currentSuffix: number === 1 ? suffix : suffixPlural,
    fullText,
  }
}

export default ApplicationView
