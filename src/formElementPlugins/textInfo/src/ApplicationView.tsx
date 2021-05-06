import React from 'react'
import { Message } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'

interface TextInfoProps {
  parameters: any
  Markdown: any
}

// Extract main content to another Component so it can be shared with SummaryView
export const TextInfoElement: React.FC<TextInfoProps> = (props) => {
  const { parameters, Markdown } = props
  const { title, text, style } = parameters
  if (['basic', 'info', 'warning', 'success', 'positive', 'negative', 'error'].includes(style)) {
    const info = style === 'info'
    const warning = style === 'warning'
    const positive = style === 'positive'
    const success = style === 'success'
    const negative = style === 'negative'
    const error = style === 'error'

    // Styled Message box
    return (
      <div className="text-info">
        <Message
          info={info}
          warning={warning}
          positive={positive}
          success={success}
          negative={negative}
          error={error}
          visible
        >
          <Markdown text={title} />
          <Markdown text={text} />
        </Message>
      </div>
    )
  }
  // Plain Markdown (default)
  else
    return (
      <div className="text-info">
        <Markdown text={title} />
        <Markdown text={text} />
      </div>
    )
}

const ApplicationView: React.FC<ApplicationViewProps> = ({ parameters, Markdown }) => {
  return <TextInfoElement parameters={parameters} Markdown={Markdown} />
}

export default ApplicationView
