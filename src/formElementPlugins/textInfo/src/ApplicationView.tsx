import React from 'react'
import { Message } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'

const ApplicationView: React.FC<ApplicationViewProps> = ({ parameters, Markdown }) => {
  return (
    <Message>
      <Message.Header>{parameters.title}</Message.Header>
      <Markdown text={parameters.text} />
    </Message>
  )
}

export default ApplicationView
