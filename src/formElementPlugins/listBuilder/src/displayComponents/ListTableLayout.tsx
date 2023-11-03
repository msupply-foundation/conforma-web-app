import React from 'react'
import { Table, TableHeaderCell, TableCell } from 'semantic-ui-react'
import { ListLayoutProps } from '../types'
import { TableCellMobileLabelWrapper } from '../../../../utils/tables/TableCellMobileLabelWrapper'
import { TemplateElement } from '../../../../utils/generated/graphql'
import { useViewport } from '../../../../contexts/ViewportState'

const ListTableLayout: React.FC<ListLayoutProps & { excludeColumns: string[] }> = ({
  listItems,
  inputFields,
  editItem = () => {},
  isEditable = true,
  excludeColumns,
  hideFromMobileIfEmpty,
  minMobileLabelWidth,
  maxMobileLabelWidth,
}) => {
  const { isMobile } = useViewport()
  const displayFields = (inputFields as TemplateElement[]).filter(
    ({ code, title }) => !(excludeColumns.includes(code) || excludeColumns.includes(title ?? ''))
  )

  const hideIfEmptyFields = (() => {
    if (typeof hideFromMobileIfEmpty === 'boolean' || hideFromMobileIfEmpty === undefined)
      return hideFromMobileIfEmpty ? displayFields.map((el) => el.code) : []

    return hideFromMobileIfEmpty
  })()

  return (
    <Table celled={!isMobile} stackable selectable={isEditable}>
      {!isMobile && (
        <Table.Header>
          <Table.Row>
            {displayFields.map(({ title }) => (
              <TableHeaderCell key={`list-header-field-${title}`}>{title}</TableHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
      )}
      <Table.Body>
        {listItems.map((item, index) => (
          <Table.Row key={`list-row-${index}`} onClick={() => editItem(index)}>
            {displayFields.map(({ code }, cellIndex) => {
              if (isMobile && hideIfEmptyFields.includes(code) && !item[code]?.value?.text)
                return null
              return (
                <TableCell key={`list-cell-${index}-${cellIndex}`}>
                  <TableCellMobileLabelWrapper
                    label={displayFields[cellIndex].title ?? ''}
                    minLabelWidth={minMobileLabelWidth}
                    maxLabelWidth={maxMobileLabelWidth}
                  >
                    {item[code]?.value?.text}
                  </TableCellMobileLabelWrapper>
                </TableCell>
              )
            })}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

export default ListTableLayout
