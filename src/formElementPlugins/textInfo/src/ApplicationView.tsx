import React from 'react'
import { Message } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'

const ApplicationView: React.FC<ApplicationViewProps> = ({ parameters, Markdown }) => {
  return (
    <div className="text-info">
      {/* <Message> */}
      <Markdown text={parameters.title} />
      <Markdown text={parameters.text} />
      {/* </Message> */}
    </div>
  )
}

export default ApplicationView
