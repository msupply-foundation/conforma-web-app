import { AiFillMethods } from '../../types'
import { createNumberFormatter, parseInput } from './helpers'

interface NumberParameters {
  type?: string
  simple?: boolean
  minValue?: number
  maxValue?: number
  locale?: string
  currency?: string
  prefix?: string
  suffix?: string
  suffixPlural?: string
  maxSignificantDigits?: number
  decimals?: number
}

// As the input saves a number when it loses focus, which it only does for a
// number that passes its own checks
const fromPlainValue: AiFillMethods['fromPlainValue'] = (value, parameters) => {
  const {
    type = 'integer',
    simple = true,
    minValue = 0,
    maxValue = Infinity,
    locale,
    currency,
    prefix,
    suffix,
    suffixPlural = suffix,
    maxSignificantDigits,
    decimals,
  } = parameters as NumberParameters

  const number = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(number)) return undefined
  if (type === 'integer' && !Number.isInteger(number)) return undefined
  if (number < minValue || number > maxValue) return undefined

  const numberFormatter = createNumberFormatter(locale, currency, maxSignificantDigits, decimals)
  const { fullText } = parseInput(
    String(number),
    numberFormatter,
    simple,
    prefix,
    suffix,
    suffixPlural
  )
  if (!fullText) return undefined

  return { text: fullText, number, type, currency, locale, prefix, suffix, suffixPlural }
}

export const aiFill: AiFillMethods = { fromPlainValue }
