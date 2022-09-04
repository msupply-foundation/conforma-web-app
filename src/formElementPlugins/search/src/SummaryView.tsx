import React from 'react'
import { SummaryViewProps } from '../../types'
import { DisplaySelection, DisplayProps } from './ApplicationView'

const SummaryView: React.FC<SummaryViewProps> = ({ parameters, Markdown, response }) => {
  const { displayFormat, displayType = 'card' } = parameters

  const displayProps: DisplayProps = {
    selection: response?.selection ?? [],
    displayFormat: displayFormat ?? {},
    displayType,
    Markdown,
    isEditable: false,
  }

  return <DisplaySelection {...displayProps} />
}

export default SummaryView
