import React from 'react'
import { Message } from 'semantic-ui-react'
import { SummaryViewProps } from '../../types'

const SummaryView: React.FC<SummaryViewProps> = ({ parameters, Markdown }) => {
  return (
    <Message>
      <Markdown text={parameters.title} />
      <Markdown text={parameters.text} />
    </Message>
  )
}

export default SummaryView
