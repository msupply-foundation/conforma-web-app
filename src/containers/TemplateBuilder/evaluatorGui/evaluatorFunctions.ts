// This file should be identical to the back-end "evaluatorFunctions.ts". It
// allows us to preview the "objectFunctions" operator in the Template Builder
// Actions config

import { DateTime, Duration } from 'luxon'

const generateExpiry = (duration: Duration) => DateTime.now().plus(duration).toJSDate()

// getYear() => "2022"
// getYear("short") => "22"
const getYear = (type?: 'short'): string =>
  type === 'short' ? String(new Date().getFullYear()).slice(2) : String(new Date().getFullYear())

type FormatDate =
  | string
  | {
      format: string
      locale?: string
    }

// Returns ISO date string or JS Date as formatted Date (Luxon). Returns current
// date if date not supplied
const getFormattedDate = (formatString: FormatDate, inputDate?: string | Date) => {
  const date = inputDate
    ? typeof inputDate === 'string'
      ? DateTime.fromISO(inputDate)
      : DateTime.fromJSDate(inputDate)
    : DateTime.now()

  if (typeof formatString === 'string') return date.toFormat(formatString)
  const { format, locale } = formatString
  return date.toFormat(format, { locale })
}

// Returns JS Date object from ISO date string. Returns current timestamp if
// no parameter supplied
const getJSDate = (date?: string) => (date ? DateTime.fromISO(date).toJSDate() : new Date())

// Returns ISO date-time string from JS Date object. Returns current timestamp
// if no parameter supplied
const getISODate = (date?: Date) =>
  date ? DateTime.fromJSDate(date).toISO() : DateTime.now().toISO()

// Extracts any numeric content from a string
const extractNumber = (input: string) => {
  const numberMatch = input.match(/(-?(\d+\.\d+))|(-?((?<!\.)\.\d+))|(-?\d+)/gm)
  if (!numberMatch) return 0
  return Number(numberMatch[0])
}

// Remove diacritics (accented characters) from strings
// See https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
const removeAccents = (input: string) => input.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export default {
  generateExpiry,
  getYear,
  getFormattedDate,
  getJSDate,
  getISODate,
  extractNumber,
  removeAccents,
}
