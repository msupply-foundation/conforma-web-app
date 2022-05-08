import React from 'react'
import { Form } from 'semantic-ui-react'
import { ResponseFull } from '../../../utils/types'
import { SummaryViewProps } from '../../types'

enum TextDisplay {
  TEXT = 'text',
  LIST = 'list',
  PROPERTYLIST = 'propertyList',
}

const getMarkdownText = (textDisplay: string, response: ResponseFull) => {
  switch (textDisplay) {
    case TextDisplay.LIST:
      return response?.textMarkdownList ?? response.text
    case TextDisplay.PROPERTYLIST:
      return response?.textMarkdownPropertyList ?? response.text
    default:
      return response.text
  }
}

const SummaryView: React.FC<SummaryViewProps> = ({ parameters, Markdown, response }) => {
  const { textDisplay = TextDisplay.LIST, label, description } = parameters
  return (
    <Form.Field className="element-summary-view">
      {label && (
        <label style={{ color: 'black' }}>
          <Markdown text={label} semanticComponent="noParagraph" />
        </label>
      )}
      <Markdown text={description} />
      <Markdown text={(response ? getMarkdownText(textDisplay, response) : '') as string} />
    </Form.Field>
  )
}

export default SummaryView
