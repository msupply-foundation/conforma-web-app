import React from 'react'
import { Message } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'
import './styles.css'

interface TextInfoProps {
  parameters: any
  Markdown: any
}

// All legal values for "style"
type TextInfoStyle =
  | 'none'
  | 'basic'
  | 'info'
  | 'warning'
  | 'success'
  | 'positive'
  | 'negative'
  | 'error'

// These values become a styled Message block. "none" or undefined/null render as plain Markdown
const styledValues: TextInfoStyle[] = [
  'basic',
  'info',
  'warning',
  'success',
  'positive',
  'negative',
  'error',
]

// Extract main content to another Component so it can be shared with SummaryView (and TemplateView)
export const TextInfoElement: React.FC<TextInfoProps> = (props) => {
  const { parameters, Markdown } = props
  const { title, text, newTabLinks = true } = parameters
  const style: TextInfoStyle = parameters?.style
  if (styledValues.includes(style)) {
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
          <Markdown text={title} newTabLinks={newTabLinks} />
          <Markdown text={formatText(text)} newTabLinks={newTabLinks} />
        </Message>
      </div>
    )
  }
  // Plain Markdown (default)
  else
    return (
      <div className="text-info">
        <Markdown text={title} newTabLinks={newTabLinks} />
        <Markdown text={formatText(text)} newTabLinks={newTabLinks} />
      </div>
    )
}

const ApplicationView: React.FC<ApplicationViewProps> = ({ parameters, Markdown }) => {
  return <TextInfoElement parameters={parameters} Markdown={Markdown} />
}

export default ApplicationView

// If text is an array or an object, this will format it nicely,
// Otherwise just gets returned as-is.
const formatText = (text: string | any): string => {
  if (!(text instanceof Object)) return text
  if (!Array.isArray(text))
    return Object.entries(text).reduce((acc, [key, value]) => acc + `**${key}**: ${value}  \n`, '')
  if (Array.isArray(text)) return text.reduce((acc, item) => acc + `- ${formatText(item)}\n`, '')
  return JSON.stringify(text)
}
