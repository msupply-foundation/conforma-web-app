// Converts Markdown text into Semantic UI components

// Please add additional renderer methods here as required

import React from 'react'
import Markdown from 'react-markdown'
import { Message } from 'semantic-ui-react'

const MarkdownBlock: React.FC<any> = (props) => {
  const { text, semanticComponent } = props
  console.log(props)

  return <Markdown children={text} renderers={renderers[semanticComponent]}></Markdown>
}

export default MarkdownBlock

const renderers: any = {
  Message: {
    root: (markdownText: any) => {
      return <Message children={markdownText.children} info />
    },
    heading: ({ node: { children }, level }: any) => {
      const text = children[0].value
      return <Message.Header>{text}</Message.Header>
    },
  },
}
