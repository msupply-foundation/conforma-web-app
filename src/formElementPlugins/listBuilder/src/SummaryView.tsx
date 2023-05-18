import React from 'react'
import { TemplateElement } from '../../../utils/generated/graphql'
import { SummaryViewProps } from '../../types'
import { Form } from 'semantic-ui-react'
import {
  ListCardLayout,
  ListTableLayout,
  ListInlineLayout,
  ListListLayout,
} from './displayComponents'
import { getDefaultDisplayFormat } from './helpers'
import { DisplayType, ListLayoutProps } from './types'

const SummaryView: React.FC<SummaryViewProps> = ({ parameters, Markdown, response }) => {
  const {
    displayType,
    inputFields,
    label,
    displayFormat = getDefaultDisplayFormat(inputFields),
    inlineOpen = false,
    tableExcludeColumns = [],
  } = parameters

  const listDisplayProps: ListLayoutProps = {
    listItems: response?.list ?? [],
    displayFormat,
    fieldTitles: inputFields.map((e: TemplateElement) => e.title),
    codes: inputFields.map((e: TemplateElement) => e.code),
    Markdown,
    isEditable: false,
  }

  const DisplayComponent =
    displayType === DisplayType.TABLE ? (
      <ListTableLayout {...listDisplayProps} excludeColumns={tableExcludeColumns} />
    ) : displayType === DisplayType.INLINE ? (
      <ListInlineLayout {...listDisplayProps} inputFields={inputFields} initialOpen={inlineOpen} />
    ) : displayType === DisplayType.LIST ? (
      <ListListLayout {...listDisplayProps} />
    ) : (
      <ListCardLayout {...listDisplayProps} />
    )

  return (
    <Form.Field>
      {label && (
        <label>
          <Markdown text={label} semanticComponent="noParagraph" />
        </label>
      )}
      {DisplayComponent}
    </Form.Field>
  )
}

export default SummaryView
