import React from 'react'
import { DateTime, DateTimeFormatOptions } from 'luxon'
import { DateTimeConstant } from '../../utils/data/LuxonDateTimeConstants'
import { DisplayDefinition, DisplayDefinitionBasic, HeaderRow } from '../../utils/types'
import { SummaryViewWrapper } from '../../formElementPlugins'
import { defaultEvaluatedElement } from '../../utils/hooks/useLoadApplication'
import { TemplateElementCategory } from '../../utils/generated/graphql'
import { ApplicationDetails } from '../../utils/types'
import config from '../../config'

export const formatCellText = (
  value: any,
  columnDetails: HeaderRow | DisplayDefinition | DisplayDefinitionBasic
): string | null => {
  const { dataType, formatting } = columnDetails
  const { elementTypePluginCode, substitution, dateFormat } = formatting
  if (elementTypePluginCode && dataType === 'json') return null // Leave these to be handled by SummaryView component
  if (!value) return ''

  // Custom formatters -- these can be chained
  let formattedValue = String(value)
  if (dataType === 'timestamp with time zone') {
    formattedValue = DateTime.fromISO(formattedValue).toLocaleString(
      interpretDateFormat(dateFormat)
    )
  }
  if (substitution) {
    formattedValue = substitution.replace('%1', formattedValue)
  }
  // Add two spaces to lines with carriage returns so Markdown renders them as line breaks
  formattedValue = formattedValue.replace(/([^\s\s]$)/gm, '$1  ')
  // Add additional custom formatters here
  return formattedValue || String(value)
}

// Takes element configurations or straight values and returns a
// SummaryViewComponent to display it. All elements in Details view show as a
// SummaryView component, but table cells can as well
export const constructElement = (value: any, displayDefinition: DisplayDefinition, id: number) => {
  const { title } = displayDefinition
  const { elementTypePluginCode, elementParameters, response } = getElementDetails(
    value,
    displayDefinition
  )
  const element = {
    id,
    code: `Detail${id}`,
    pluginCode: elementTypePluginCode as string,
    category: TemplateElementCategory.Information,
    title,
    parameters: elementParameters,
    validationExpression: true,
    validationMessage: '',
    elementIndex: 0,
    page: 0,
    sectionIndex: 0,
    helpText: null,
    sectionCode: '0',
    ...defaultEvaluatedElement,
    isRequired: false,
  }
  return (
    <SummaryViewWrapper
      element={element}
      applicationData={{ config } as ApplicationDetails}
      /* TODO this is a hacky way of passing through server URL, I think it needs to be decoupled from applicationData. Config is needed for log_url in organisation to be displayed with imageDisplays plugin */
      response={response}
      allResponses={{}}
    />
  )
}

export const getElementDetails = (value: any, displayDefinition: DisplayDefinition) => {
  // If it's not already a plugin element, structure it as a shortText
  // element for display purposes
  const { formatting, dataType } = displayDefinition
  const isAlreadyElement = !!formatting?.elementTypePluginCode
  const elementTypePluginCode = isAlreadyElement ? formatting?.elementTypePluginCode : 'shortText'
  const elementParameters = isAlreadyElement
    ? formatting?.elementParameters
    : {
        label: displayDefinition.title,
      }
  const response =
    isAlreadyElement && dataType === 'jsonb'
      ? value
      : { text: formatCellText(value, displayDefinition) }
  return { elementTypePluginCode, elementParameters, response }
}

const interpretDateFormat = (
  dateFormat: DateTimeConstant | DateTimeFormatOptions | undefined
): DateTimeFormatOptions => {
  if (!dateFormat) return {}
  if (typeof dateFormat === 'string' && DateTime?.[dateFormat]) return DateTime[dateFormat]
  return dateFormat as DateTimeFormatOptions
}
