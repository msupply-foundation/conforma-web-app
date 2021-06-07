import React from 'react'
import { SummaryViewProps } from '../../types'
import { DisplaySelection, DisplayProps } from './ApplicationView'

const SummaryView: React.FC<SummaryViewProps> = ({ evaluatedParameters, Markdown, response }) => {
  const { displayFormat } = evaluatedParameters

  const displayProps: DisplayProps = {
    selection: response?.selection ?? [],
    displayFormat: displayFormat ?? {},
    Markdown,
    isEditable: false,
  }

  return <DisplaySelection {...displayProps} />
}

export default SummaryView
