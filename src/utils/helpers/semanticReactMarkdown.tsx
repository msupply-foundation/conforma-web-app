// Converts Markdown text into Semantic UI components
// Uses ReactMarkdown library: https://www.npmjs.com/package/react-markdown

// If no semanticComponent prop is supplied, will return standard HTML.

import React from 'react'
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown'
import { Message, Icon } from 'semantic-ui-react'

type SemanticComponent = 'Message' | 'noParagraph' // Enum for available renderers
interface MarkdownBlockProps {
  text: string
  semanticComponent?: SemanticComponent
  info?: boolean
  error?: boolean
}
type Renderers = {
  [key: string]: any
}

const MarkdownBlock: React.FC<MarkdownBlockProps> = (props) => {
  const { text, semanticComponent, info, error } = props

  // These methods override the default HTML output for each type of
  // Markdown node (heading, paragraph, etc.) so we can render them as Semantic
  // components instead.
  // Please add additional renderer methods here as required.
  const renderers: Renderers = {
    Message: {
      root: (input: ReactMarkdownProps) => {
        return <Message children={input.children} info={info} error={error} />
      },
      heading: ({ node: { children }, level }: any) => {
        const headingText = children[0].value
        return (
          <Message.Header>
            {info && <Icon name="info circle" />}
            {error && <Icon name="exclamation circle" />}
            {headingText}
          </Message.Header>
        )
      },
    },
    // Prevents returned HTML from being wrapped in <p></p> tags
    noParagraph: {
      paragraph: ({ node: { children } }: any) => {
        return <span>{children[0].value}</span>
      },
    },
  }

  const renderer = semanticComponent ? renderers[semanticComponent] : null

  return <ReactMarkdown children={text} renderers={renderer}></ReactMarkdown>
}

export default MarkdownBlock
