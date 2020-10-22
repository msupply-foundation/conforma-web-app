import React from 'react'
import { Message } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'

const ApplicationView: React.FC<ApplicatioViewProps> = ({ templateElement: { parameters } }) => {
  return (
    <Message>
      <Message.Header>{parameters.title}</Message.Header>
      <p>{parameters.text}</p>
    </Message>
  )
}

export default ApplicationView
