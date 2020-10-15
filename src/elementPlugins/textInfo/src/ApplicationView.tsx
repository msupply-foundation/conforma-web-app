import React from 'react'
import { Message } from 'semantic-ui-react'
import { ApplicatioViewProps } from '../../types'

const ApplicationView = ({ templateElement: { parameters } }: ApplicatioViewProps) => {
  return (
    <Message>
      <Message.Header>{parameters.title}</Message.Header>
      <p>{parameters.text}</p>
    </Message>
  )
}

export default ApplicationView
