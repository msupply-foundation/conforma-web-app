import React from 'react'
import { DateTime, DateTimeFormatOptions } from 'luxon'
import { DateTimeConstant } from '../../utils/data/LuxonDateTimeConstants'
import {
  BasicStringObject,
  DataViewsTableResponse,
  DataViewTableAPIQueries,
  DisplayDefinition,
  DisplayDefinitionBasic,
  FilterDefinitions,
  HeaderRow,
} from '../../utils/types'
import { substituteValues } from '../../utils/helpers/utilityFunctions'
import { SummaryViewWrapper } from '../../formElementPlugins'
import { defaultEvaluatedElement } from '../../utils/hooks/useLoadApplication'
import { TemplateElementCategory } from '../../utils/generated/graphql'
import { ApplicationDetails } from '../../utils/types'
import config from '../../config'
import { serverREST, serverGraphQL } from '../../utils/helpers/endpoints/endpointUrlBuilder'
import buildQueryFilters from '../../utils/helpers/list/buildQueryFilters'

export const formatCellText = (
  value: any,
  columnDetails: HeaderRow | DisplayDefinition | DisplayDefinitionBasic
): string | null => {
  const { dataType, formatting } = columnDetails
  const { elementTypePluginCode, substitution, dateFormat } = formatting
  if (elementTypePluginCode && dataType === 'object') return null // Leave these to be handled by SummaryView component
  if (!value) return ''

  // Handle array values by building a Markdown list, and formatting each
  // element within
  if (Array.isArray(value))
    return value.reduce(
      (markdownList: string, element: any) =>
        markdownList + `- ${formatCellText(element, columnDetails)}\n`,
      ''
    )
  // Custom formatters -- these can be chained
  let formattedValue = String(value)
  // TO-DO: Standardize dataType options, see issue #992
  if (dataType === 'Date') {
    formattedValue = DateTime.fromISO(formattedValue).toLocaleString(
      interpretDateFormat(dateFormat)
    )
  }
  if (substitution) {
    formattedValue = substituteValues(substitution, value)
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
    reviewability: null,
  }

  return (
    <SummaryViewWrapper
      element={element}
      // Only "config" info is available in "applicationData", as we're not
      // using as part of an application. We need server urls, as some plugin
      // displays (e.g. imageDisplay) require local server urls.
      applicationData={
        {
          config: {
            serverGraphQL,
            serverREST,
            isProductionBuild: config.isProductionBuild,
            version: config.version,
          },
        } as ApplicationDetails
      }
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
    ? formatting?.elementParameters ?? {}
    : {
        label: displayDefinition.title,
      }
  const response =
    isAlreadyElement && dataType === 'object'
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
