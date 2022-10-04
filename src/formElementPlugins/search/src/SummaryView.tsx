import React from 'react'
import { Form } from 'semantic-ui-react'
import { SummaryViewProps } from '../../types'
import { DisplaySelection, DisplayProps } from './ApplicationView'

const SummaryView: React.FC<SummaryViewProps> = ({ parameters, Markdown, response }) => {
  const { label, displayFormat, displayType = 'card' } = parameters

  const displayProps: DisplayProps = {
    selection: response?.selection ?? [],
    displayFormat: displayFormat ?? {},
    displayType,
    Markdown,
    isEditable: false,
  }

  return (
    <Form.Field>
      {label && (
        <label>
          <Markdown text={label} semanticComponent="noParagraph" />
        </label>
      )}
      <DisplaySelection {...displayProps} />
    </Form.Field>
  )
}

export default SummaryView
