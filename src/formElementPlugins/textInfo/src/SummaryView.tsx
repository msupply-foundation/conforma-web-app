import React from 'react'
import { SummaryViewProps } from '../../types'
import { TextInfoElement } from './ApplicationView'

const SummaryView: React.FC<SummaryViewProps> = ({ parameters, Markdown }) => {
  console.log('Summery')

  return <TextInfoElement parameters={parameters} Markdown={Markdown} />
}

export default SummaryView
