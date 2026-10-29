import { DateTime } from 'luxon'

// Stored response date format
export interface DateSaved {
  start: string | null | undefined // ISO Date strings: YYYY-MM-DD
  end?: string | null | undefined
}

// This is the type used by react-semantic-ui-datepicker, and what we use for
// local "value" here
export type SelectedDateRange = Date[] | Date | null

export type DateFormat = 'short' | 'med' | 'medWeekday' | 'full' | 'huge'
export const dateFormats = {
  short: DateTime.DATE_SHORT,
  med: DateTime.DATE_MED,
  medWeekday: DateTime.DATE_MED_WITH_WEEKDAY,
  full: DateTime.DATE_FULL,
  huge: DateTime.DATE_HUGE,
}

export const toDateSaved = (date: SelectedDateRange): DateSaved | null => {
  if (!date) return null
  // Single date
  if (!Array.isArray(date)) return { start: DateTime.fromJSDate(date).toISODate() ?? undefined }
  // Date range
  return {
    start: DateTime.fromJSDate(date[0]).toISODate() ?? undefined,
    end: DateTime.fromJSDate(date[1]).toISODate() ?? undefined,
  }
}

export const fromDateSaved = (date: DateSaved | null): SelectedDateRange | null => {
  if (!date || !date.start) return null
  // Single date
  if (!date?.end) return DateTime.fromISO(date.start).toJSDate()
  // Date range
  return [DateTime.fromISO(date.start).toJSDate(), DateTime.fromISO(date.end).toJSDate()]
}

export const toDisplayString = (
  date: SelectedDateRange,
  locale: string,
  format: DateFormat
): string | null => {
  if (!date) return null

  const formatDate = (date: DateTime) => {
    if (format in dateFormats) {
      const localeFormat = dateFormats[format as DateFormat]
      return date.setLocale(locale).toLocaleString(localeFormat)
    }
    return date.toFormat(format)
  }

  // Single date
  if (!Array.isArray(date)) return formatDate(DateTime.fromJSDate(date))
  // Date range
  return `${formatDate(DateTime.fromJSDate(date[0]))} – ${DateTime.fromJSDate(date[1])}`
}

export const dateFromDefault = (defaultDate: string | string[] | null): SelectedDateRange => {
  if (!defaultDate) return null
  // Single date
  if (!Array.isArray(defaultDate)) return DateTime.fromISO(defaultDate).toJSDate()
  // Date range
  return defaultDate.map((date) => DateTime.fromISO(date).toJSDate())
}

export const getDateLimits = (
  minDate: string | undefined,
  maxDate: string | undefined,
  minAge: number,
  maxAge: number
) => {
  const minAgeDate = DateTime.now().minus({ years: minAge })
  const maxAgeDate = DateTime.now().minus({ years: maxAge })
  const maxDateObject = maxDate ? DateTime.fromISO(maxDate) : null
  const minDateObject = minDate ? DateTime.fromISO(minDate) : null
  const maxDateCalculated =
    !maxDateObject || minAgeDate < maxDateObject ? minAgeDate : maxDateObject
  const minDateCalculated =
    !minDateObject || maxAgeDate > minDateObject ? maxAgeDate : minDateObject
  return [minDateCalculated.toJSDate(), maxDateCalculated.toJSDate()]
}
