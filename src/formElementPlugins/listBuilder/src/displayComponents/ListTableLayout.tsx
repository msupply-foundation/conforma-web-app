import React, { useMemo } from 'react'
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
  tableWidth,
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

  // An explicitly configured "tableWidth" parameter takes precedence.
  // Otherwise, estimate the minimum table width based on column content. If
  // the estimated width exceeds 450px, apply it directly (up to 550px) so the
  // table can overflow its container rather than squeezing columns.
  const CHAR_WIDTH = 8
  const CELL_PADDING = 24
  const DEFAULT_COL_MIN = 80

  const width = useMemo(() => {
    if (tableWidth !== undefined) return tableWidth
    const totalMinWidth = displayFields.reduce((total, { code, title }) => {
      const headerWidth = (title?.length ?? 0) * CHAR_WIDTH + CELL_PADDING
      const maxCellWidth = listItems.reduce((max, item) => {
        const text = item[code]?.value?.text ?? ''
        const isNowrap = /^[$€£¥]/.test(text.trim())
        const cellWidth = isNowrap ? text.length * CHAR_WIDTH + CELL_PADDING : DEFAULT_COL_MIN
        return Math.max(max, cellWidth)
      }, 0)
      return total + Math.max(headerWidth, maxCellWidth)
    }, 0)
    if (totalMinWidth <= 450) return undefined
    return Math.min(totalMinWidth, 550)
  }, [tableWidth, displayFields, listItems])

  return (
    <Table
      celled={!isMobile}
      stackable
      selectable={isEditable}
      style={width !== undefined ? { width } : undefined}
    >
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
              const cellText = item[code]?.value?.text ?? ''
              if (isMobile && hideIfEmptyFields.includes(code) && !cellText) return null
              const isCurrency = /^[$€£¥]/.test(cellText.trim())
              return (
                <TableCell
                  key={`list-cell-${index}-${cellIndex}`}
                  style={isCurrency ? { whiteSpace: 'nowrap' } : undefined}
                >
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
