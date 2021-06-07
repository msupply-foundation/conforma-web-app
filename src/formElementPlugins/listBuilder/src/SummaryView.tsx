import React from 'react'
import { TemplateElement } from '../../../utils/generated/graphql'
import { SummaryViewProps } from '../../types'
import { ListCardLayout, ListTableLayout, ListLayoutProps, DisplayType } from './ApplicationView'

const SummaryView: React.FC<SummaryViewProps> = ({ evaluatedParameters, Markdown, response }) => {
  const { displayType, displayFormat, inputFields } = evaluatedParameters

  const listDisplayProps: ListLayoutProps = {
    listItems: response?.list ?? [],
    displayFormat,
    fieldTitles: inputFields.map((e: TemplateElement) => e.title),
    Markdown,
    isEditable: false,
  }

  return displayType === DisplayType.TABLE ? (
    <ListTableLayout {...listDisplayProps} />
  ) : (
    <ListCardLayout {...listDisplayProps} />
  )
}

export default SummaryView
