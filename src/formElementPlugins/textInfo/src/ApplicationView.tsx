import React from 'react'
import { Message, MessageContentProps } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'

const ApplicationView: React.FC<ApplicationViewProps> = ({ parameters, Markdown }) => {
  console.log('Parameters', parameters)
  const { title, text, style } = parameters
  if (['basic', 'info', 'warning', 'success', 'positive', 'negative', 'error'].includes(style)) {
    const basic = style === 'basic'
    const info = style === 'info'
    const warning = style === 'warning'
    const positive = style === 'success' || style === 'positive'
    const negative = style === 'negative' || style === 'error'

    return (
      <div className="text-info">
        <Message
          basic={basic}
          info={info}
          warning={warning}
          positive={positive}
          negative={negative}
          visible
        >
          <Markdown text={title} />
          <Markdown text={text} />
        </Message>
      </div>
    )
  } else
    return (
      <div className="text-info">
        <Markdown text={title} />
        <Markdown text={text} />
      </div>
    )
}

export default ApplicationView
