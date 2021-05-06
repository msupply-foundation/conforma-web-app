import React from 'react'
import { Message } from 'semantic-ui-react'
import { SummaryViewProps } from '../../types'

const SummaryView: React.FC<SummaryViewProps> = ({ parameters, Markdown }) => {
  return (
    <div className="text-info">
      {/* <Message> */}
      <Markdown text={parameters.title} />
      <Markdown text={parameters.text} />
      {/* </Message> */}
    </div>
  )
}

export default SummaryView
