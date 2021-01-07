import React from 'react'
import { Message } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'
import Markdown from '../../../utils/helpers/semanticReactMarkdown'

const ApplicationView: React.FC<ApplicationViewProps> = ({ parameters }) => {
  return (
    <Message>
      <Message.Header>{parameters.title}</Message.Header>
      <Markdown text={parameters.text} />
    </Message>
  )
}

export default ApplicationView
