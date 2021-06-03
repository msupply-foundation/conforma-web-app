import React, { useEffect, useState, useMemo } from 'react'
import { ApplicationViewProps } from '../../types'
import SemanticDatepicker from 'react-semantic-ui-datepickers'
import { DateTime } from 'luxon'
import './styles.less'
// import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css'

interface DateRange {
  start: Date
  end?: Date
}

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
  const [selectedDate, setSelectedDate] = useState<DateRange | null>(
    dateFromISOStrings(currentResponse?.date)
  )
  const { isEditable } = element
  const {
    label,
    description,
    default: defaultDate,
    allowRange = false,
    locale = 'en-US',
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

  console.log('date', selectedDate)

  // Set "default" date if present
  useEffect(() => {
    if (!selectedDate && defaultDate) {
      const date = dateFromDefault(defaultDate)
      onSave({ text: dateToDisplayString(date, locale, displayFormat), date })
      setSelectedDate(date)
    }
  }, [defaultDate])

  useEffect(() => {
    onSave({
      text: dateToDisplayString(selectedDate, locale, displayFormat),
      date: dateToISOStrings(selectedDate),
    })
  }, [selectedDate])

  const handleSelect = (event: any, data: any) => {
    const date = data.value
    if (!date) {
      setSelectedDate(null)
      return
    }
    if (Array.isArray(date))
      setSelectedDate({
        start: date[0],
        end: date[1],
      })
    else setSelectedDate({ start: date })
  }

  return (
    <>
      <label>
        <Markdown text={label} semanticComponent="noParagraph" />
      </label>
      <Markdown text={description} />
      <SemanticDatepicker
        locale={locale}
        onChange={handleSelect}
        type={allowRange ? 'range' : 'basic'}
        // value={toJSDate(selectedDate)}
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

const toJSDate = (date: DateRange | null) => {
  if (!date) return undefined
  if (!date.end) return new Date(date.start)
  return [new Date(date.start), new Date(date.end)]
}

const dateToISOStrings = (date: DateRange | null) => {
  if (!date) return null
  return Object.entries(date).reduce(
    (newObj, [key, value]) => ({ ...newObj, [key]: DateTime.fromJSDate(value).toISODate() }),
    {}
  )
}

const dateFromISOStrings = (date: { start: string; end?: string } | null) => {
  if (!date) return null
  return Object.entries(date).reduce(
    (newObj, [key, value]: any) => ({ ...newObj, [key]: DateTime.fromISO(value).toJSDate() }),
    {}
  )
}

const dateToDisplayString = (date: DateRange | null, locale: string, format: DateFormats) => {
  const dateStartString =
    date && DateTime.fromJSDate(date.start).setLocale(locale).toLocaleString(dateFormats[format])
  // single date
  if (!date?.end) return dateStartString
  // date range
  const dateEndString = DateTime.fromJSDate(date.end)
    .setLocale(locale)
    .toLocaleString(dateFormats[format])
  return `${dateStartString} – ${dateEndString}`
}

const dateFromDefault = (defaultDate: string | string[]) => {
  if (Array.isArray(defaultDate))
    return {
      start: DateTime.fromISO(defaultDate[0]).toJSDate(),
      end: DateTime.fromISO(defaultDate[1]).toJSDate(),
    }
  else return { start: DateTime.fromISO(defaultDate).toJSDate() }
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
