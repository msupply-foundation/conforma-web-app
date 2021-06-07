import React from 'react'
import { SummaryViewProps } from '../../types'
import { TextInfoElement } from './ApplicationView'

const SummaryView: React.FC<SummaryViewProps> = ({ evaluatedParameters, Markdown }) => {
  return <TextInfoElement parameters={evaluatedParameters} Markdown={Markdown} />
}

export default SummaryView
