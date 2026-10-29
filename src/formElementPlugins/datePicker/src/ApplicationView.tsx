import React, { useState, useMemo } from 'react'
import { ApplicationViewProps } from '../../types'
import SemanticDatepicker from 'react-semantic-ui-datepickers'
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css'
import { useLanguageProvider } from '../../../contexts/Localisation'
import useDefault from '../../useDefault'
import { Label } from 'semantic-ui-react'
import {
  SelectedDateRange,
  dateFromDefault,
  fromDateSaved,
  getDateLimits,
  toDateSaved,
  toDisplayString,
} from './helpers'

const ApplicationView: React.FC<ApplicationViewProps> = ({
  element,
  parameters,
  // onUpdate,
  // setIsActive,
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
    parameters,
    onChange: (defaultDate) => {
      const date = dateFromDefault(defaultDate)
      handleSelect(date)
    },
  })

  const handleSelect = (date?: SelectedDateRange) => {
    if (date === undefined) return

    // The DatePicker component doesn't check that date falls within allowed
    // range when it is manually entered, so we need to check it here.
    const [minDate, maxDate] =
      date instanceof Date ? [date, date] : Array.isArray(date) ? [date[0], date[1]] : [null, null]
    if (
      minDate !== null &&
      maxDate !== null &&
      (minDate < minDateValue || maxDate > maxDateValue)
    ) {
      console.log('Selected date outside allowed range')
      setSelectedDate(null)
      return
    }

    setSelectedDate(date)
    onSave({ text: toDisplayString(date, locale, displayFormat), date: toDateSaved(date) })
  }

  const isError = !validationState.isValid

  return (
    <>
      {label && (
        <label>
          <Markdown text={label} semanticComponent="noParagraph" />
        </label>
      )}
      <Markdown text={description} />
      <div className="flex-column-start-start">
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
          className={isError ? 'input-error' : undefined}
        />
        {isError && (
          <Label
            basic
            color="pink"
            pointing
            content={validationState?.validationMessage}
            className="prompt"
            style={{ marginTop: 0 }}
          />
        )}
      </div>
    </>
  )
}

export default ApplicationView
