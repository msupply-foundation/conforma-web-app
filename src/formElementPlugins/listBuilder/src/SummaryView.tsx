import React from 'react'
import { SummaryViewProps } from '../../types'
import { ListCardLayout, ListTableLayout } from './ApplicationView'

const SummaryView: React.FC<SummaryViewProps> = ({ parameters, Markdown, response }) => {
  const { displayType, displayFormat, inputFields } = parameters

  const listDisplayProps = {
    listItems: response?.list,
    displayFormat,
    fieldTitles: inputFields.map((e: any) => e.title),
    Markdown,
    isEditable: false,
  }

  return displayType === 'table' ? (
    <ListTableLayout {...listDisplayProps} />
  ) : (
    <ListCardLayout {...listDisplayProps} />
  )
}

export default SummaryView
