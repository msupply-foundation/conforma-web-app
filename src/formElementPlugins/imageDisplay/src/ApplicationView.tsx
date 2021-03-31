import React from 'react'
import { Message } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'

const ApplicationView: React.FC<ApplicationViewProps> = ({ parameters }) => {
  const { url, maxWidth, maxHeight, alignment, altText } = parameters

  return (
    <Message>
      <Message.Header>{parameters.title}</Message.Header>
    </Message>
  )
}

export default ApplicationView
