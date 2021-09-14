import React from 'react'
import { DisplayDefinition, HeaderRow } from './types'
import { SummaryViewWrapper } from '../../formElementPlugins'
import Markdown from '../../utils/helpers/semanticReactMarkdown'

type FormattedCellProps = {
  value: any
  columnDetails: HeaderRow | DisplayDefinition
}

export const FormattedCell: React.FC<FormattedCellProps> = ({ value, columnDetails }) => {
  if (!value) return <Markdown text="" />
  // Return formatted cell
  const { dataType, formatting } = columnDetails
  const { elementTypePluginCode, elementParameters, substitution, dateFormat } = formatting

  let formattedValue: any
  if (dataType === 'timestamp with time zone') {
    // Convert to Date string
    formattedValue = value
  }
  if (substitution) {
    formattedValue = substitution.replace('%1', formattedValue ?? value)
  }
  if (!elementTypePluginCode) return <Markdown text={formattedValue || String(value)} />
  console.log('Formatting', columnDetails)
  console.log('Value', value)
  console.log('formattedValue', formattedValue)
  // Return a SummaryView component
  if (!elementParameters) return <p>'Missing element parameters'</p>
  // Render Summary View
  return <p>Plugin render goes here</p>
}

export const formatCellText = (
  value: any,
  columnDetails: HeaderRow | DisplayDefinition
): string | null => {
  const { dataType, formatting } = columnDetails
  const { elementTypePluginCode, substitution, dateFormat } = formatting
  if (elementTypePluginCode) return null // Leave these to be handled by SummaryView component
  if (!value) return ''

  // Custom formatters -- these can be chained
  let formattedValue: any
  if (dataType === 'timestamp with time zone') {
    // TO-DO Convert to Luxon Date string
    formattedValue = value
  }
  if (substitution) {
    formattedValue = substitution.replace('%1', formattedValue ?? value)
  }
  // Add other custom formatters here
  return formattedValue || String(value)
}
