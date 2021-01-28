import React from 'react'
import { Message } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'

const SummaryView: React.FC<ApplicationViewProps> = ({ parameters, Markdown }) => {
  return (
    <div>
      <p>This is a Summary View</p>
    </div>
  )
}

export default SummaryView
