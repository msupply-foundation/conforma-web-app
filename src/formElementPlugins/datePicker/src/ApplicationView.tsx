import React, { useEffect, useState, useMemo } from 'react'
import { Form } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'
import SemanticDatepicker from 'react-semantic-ui-datepickers'
import { DateTime, Duration } from 'luxon'
import './temp.less'
// import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css'

interface DateRange {
  start: Date
  end?: Date
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
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>()
  const { isEditable } = element
  const {
    label,
    description,
    default: defaultDate,
    allowRange = false,
    locale = 'en-US',
    format = 'DD-MM-YYYY',
    minDate,
    maxDate,
    minAge = 18,
    maxAge = 1000,
    showToday = true,
    firstDayOfWeek = 0,
  } = parameters

  // calculate Max and Min dates
  const [minDateValue, maxDateValue] = useMemo(
    () => getDateLimits(minDate, maxDate, minAge, maxAge),
    [minDate, maxDate, minAge, maxAge]
  )

  useEffect(() => {
    onSave({ text: dateToString(selectedDate), date: selectedDate })
  }, [selectedDate])

  const handleSelect = (event: any, data: any) => {
    const date = data.value
    console.log('Date', date)
    console.log('DateISO', date.toISOString())
    console.log('DateViaLuxon', DateTime.fromJSDate(date))
    console.log('DateLuxonISO', DateTime.fromJSDate(date).toISO())

    if (Array.isArray(date)) setSelectedDate({ start: date[0], end: date[1] })
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
        // value={new Date('1976-12-23')}
        // maxDate={new Date()}
        format={format}
        firstDayOfWeek={firstDayOfWeek}
        showToday={showToday}
        maxDate={maxDateValue}
        minDate={minDateValue}
      />
    </>
  )
}

const dateToString = (date: DateRange | undefined) => JSON.stringify(date)

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
