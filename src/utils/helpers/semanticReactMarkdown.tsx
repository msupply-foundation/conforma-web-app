// Converts Markdown text into Semantic UI components
// Uses ReactMarkdown library: https://www.npmjs.com/package/react-markdown

import React from 'react'
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown'
import { Message, Icon } from 'semantic-ui-react'

interface MarkdownBlockProps {
  text: string
  semanticComponent: string
  info?: boolean
}
type Renderers = {
  [key: string]: any
}

const MarkdownBlock: React.FC<MarkdownBlockProps> = (props) => {
  const { text, semanticComponent, info } = props

  // These methods override the default HTML output for each type of
  // Markdown node (heading, paragraph, etc.) so we can render them as Semantic
  // components instead.
  // Please add additional renderer methods here as required.
  const renderers: Renderers = {
    Message: {
      root: (input: ReactMarkdownProps) => {
        return <Message children={input.children} info={info} />
      },
      heading: ({ node: { children }, level }: any) => {
        const headingText = children[0].value
        return (
          <Message.Header>
            {info && <Icon name="info circle" />}
            {headingText}
          </Message.Header>
        )
      },
    },
  }

  return <ReactMarkdown children={text} renderers={renderers[semanticComponent]}></ReactMarkdown>
}

export default MarkdownBlock
