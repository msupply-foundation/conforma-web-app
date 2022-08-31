import React from 'react'
import { Form } from 'semantic-ui-react'
import { getCheckboxStructure, CheckboxDisplay } from './ApplicationView'
import { SummaryViewProps } from '../../types'

enum DisplayFormat {
  TEXT = 'text',
  LIST = 'list',
  PROPERTYLIST = 'propertyList',
  CHECKBOXES = 'checkboxes',
}

const SummaryView: React.FC<SummaryViewProps> = ({ parameters, Markdown, response }) => {
  const {
    displayFormat = DisplayFormat.LIST,
    label,
    description,
    checkboxes,
    layout,
    type,
    keyMap,
  } = parameters
  let displayComponent
  switch (displayFormat) {
    case DisplayFormat.LIST:
      displayComponent = (
        <Markdown text={(response ? response?.textMarkdownList || response.text : '') as string} />
      )
      break
    case DisplayFormat.PROPERTYLIST:
      displayComponent = (
        <Markdown
          text={(response ? response?.textMarkdownPropertyList || response.text : '') as string}
        />
      )
      break
    case DisplayFormat.CHECKBOXES:
      displayComponent = (
        <CheckboxDisplay
          checkboxes={getCheckboxStructure(
            response ?? {
              // If no response exists, we still want to display an empty
              // checkbox array
              text: '',
              values: {},
            },
            checkboxes,
            keyMap,
            true
          )}
          disabled
          type={type}
          layout={layout}
          onChange={() => {}}
        />
      )
      break
    default:
      displayComponent = <Markdown text={(response ? response.text : '') as string} />
  }
  return (
    <Form.Field className="element-summary-view">
      {label && (
        <label style={{ color: 'black' }}>
          <Markdown text={label} semanticComponent="noParagraph" />
        </label>
      )}
      <Markdown text={description} />
      {displayComponent}
    </Form.Field>
  )
}

export default SummaryView
