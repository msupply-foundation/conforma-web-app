import { DateTime } from 'luxon'
import { AiFillMethods, AiFillParameters } from '../../types'
import { DateFormat, getDateLimits, toDateSaved, toDisplayString } from './helpers'

interface DatePickerParameters {
  allowRange?: boolean
  default?: unknown
  locale?: string
  displayFormat?: DateFormat
  minDate?: string
  maxDate?: string
  minAge?: number
  maxAge?: number
}

// Defaults as in ApplicationView
const isRange = ({ allowRange, default: defaultValue }: DatePickerParameters) =>
  allowRange ?? Array.isArray(defaultValue)

// The AI service gives a single date, so a date range can't be filled
const describe = (parameters: AiFillParameters) =>
  isRange(parameters as DatePickerParameters) ? undefined : {}

// As the picker saves a date it accepts: within the element's limits
const fromPlainValue: AiFillMethods['fromPlainValue'] = (value, parameters, context) => {
  const {
    locale = context.locale,
    displayFormat = 'short',
    minDate,
    maxDate,
    minAge = -1000,
    maxAge = 1000,
  } = parameters as DatePickerParameters
  if (typeof value !== 'string' || isRange(parameters as DatePickerParameters)) return undefined

  const parsed = DateTime.fromISO(value)
  if (!parsed.isValid) return undefined
  const date = parsed.toJSDate()
  const [minDateValue, maxDateValue] = getDateLimits(minDate, maxDate, minAge, maxAge)
  if (date < minDateValue || date > maxDateValue) return undefined

  return { text: toDisplayString(date, locale, displayFormat) ?? '', date: toDateSaved(date) }
}

export const aiFill: AiFillMethods = { describe, fromPlainValue }
