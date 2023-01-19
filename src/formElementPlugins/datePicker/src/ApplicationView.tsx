import React, { useState, useMemo } from 'react'
import { ApplicationViewProps } from '../../types'
import SemanticDatepicker from 'react-semantic-ui-datepickers'
import { DateTime } from 'luxon'
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { LocaleOptions } from 'react-semantic-ui-datepickers/dist/types'
import useDefault from '../../useDefault'

// Stored response date format
interface DateSaved {
  start: string // ISO Date strings: YYYY-MM-DD
  end?: string
}

// This is the type used by react-semantic-ui-datepicker, and what we use for local "value" here
type SelectedDateRange = Date[] | Date | null

type DateFormats = 'short' | 'med' | 'medWeekday' | 'full' | 'huge'
const dateFormats = {
  short: DateTime.DATE_SHORT,
  med: DateTime.DATE_MED,
  medWeekday: DateTime.DATE_MED_WITH_WEEKDAY,
  full: DateTime.DATE_FULL,
  huge: DateTime.DATE_HUGE,
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
  const [selectedDate, setSelectedDate] = useState<SelectedDateRange>(
    fromDateSaved(currentResponse?.date)
  )
  const { selectedLanguage } = useLanguageProvider()
  const { isEditable } = element
  const {
    label,
    description,
    default: defaultValue,
    replaceResponseOnDefaultChange,
    allowRange = Array.isArray(defaultValue),
    locale = selectedLanguage.locale,
    displayFormat = 'short',
    entryFormat = 'YYYY-MM-DD',
    minDate,
    maxDate,
    minAge = -1000,
    maxAge = 1000,
    showToday = true,
    firstDayOfWeek = 0,
  } = parameters

  // calculate Max and Min dates
  const [minDateValue, maxDateValue] = useMemo(
    () => getDateLimits(minDate, maxDate, minAge, maxAge),
    [minDate, maxDate, minAge, maxAge]
  )

  useDefault({
    defaultValue,
    currentResponse,
    replaceResponseOnDefaultChange,
    onChange: (defaultDate) => {
      const date = dateFromDefault(defaultDate)
      handleSelect(date)
    },
  })

  const handleSelect = (date?: SelectedDateRange) => {
    if (date === undefined) return
    setSelectedDate(date)
    onSave({ text: toDisplayString(date, locale, displayFormat), date: toDateSaved(date) })
  }

  return (
    <>
      {label && (
        <label>
          <Markdown text={label} semanticComponent="noParagraph" />
        </label>
      )}
      <Markdown text={description} />
      <SemanticDatepicker
        locale={locale}
        onChange={(_, data) => handleSelect(data.value)}
        type={allowRange ? 'range' : 'basic'}
        value={selectedDate}
        format={entryFormat}
        firstDayOfWeek={firstDayOfWeek}
        showToday={showToday}
        maxDate={maxDateValue}
        minDate={minDateValue}
        disabled={!isEditable}
      />
    </>
  )
}

const toDateSaved = (date: SelectedDateRange): DateSaved | null => {
  if (!date) return null
  // Single date
  if (!Array.isArray(date)) return { start: DateTime.fromJSDate(date).toISODate() }
  // Date range
  return {
    start: DateTime.fromJSDate(date[0]).toISODate(),
    end: DateTime.fromJSDate(date[1]).toISODate(),
  }
}

const fromDateSaved = (date: DateSaved | null): SelectedDateRange | null => {
  if (!date) return null
  // Single date
  if (!date?.end) return DateTime.fromISO(date.start).toJSDate()
  // Date range
  return [DateTime.fromISO(date.start).toJSDate(), DateTime.fromISO(date.end).toJSDate()]
}

const toDisplayString = (
  date: SelectedDateRange,
  locale: string,
  format: DateFormats
): string | null => {
  if (!date) return null
  // Single date
  if (!Array.isArray(date))
    return DateTime.fromJSDate(date).setLocale(locale).toLocaleString(dateFormats[format])
  // Date range
  return `${DateTime.fromJSDate(date[0])
    .setLocale(locale)
    .toLocaleString(dateFormats[format])} – ${DateTime.fromJSDate(date[1])
    .setLocale(locale)
    .toLocaleString(dateFormats[format])}`
}

const dateFromDefault = (defaultDate: string | string[]): SelectedDateRange => {
  // Single date
  if (!Array.isArray(defaultDate)) return DateTime.fromISO(defaultDate).toJSDate()
  // Date range
  return defaultDate.map((date) => DateTime.fromISO(date).toJSDate())
}

const getDateLimits = (
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

export default ApplicationView
