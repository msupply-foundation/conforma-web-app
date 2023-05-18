import React from 'react'
import { Table, TableHeaderCell, TableCell } from 'semantic-ui-react'
import { ListLayoutProps } from '../types'
import { TemplateElement } from '../../../../utils/generated/graphql'

const ListTableLayout: React.FC<ListLayoutProps & { excludeColumns: string[] }> = ({
  listItems,
  inputFields,
  editItem = () => {},
  isEditable = true,
  excludeColumns,
}) => {
  const displayFields = (inputFields as TemplateElement[]).filter(
    ({ code, title }) => !(excludeColumns.includes(code) || excludeColumns.includes(title ?? ''))
  )
  return (
    <Table celled selectable={isEditable}>
      <Table.Header>
        <Table.Row>
          {displayFields.map(({ title }) => (
            <TableHeaderCell key={`list-header-field-${title}`}>{title}</TableHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {listItems.map((item, index) => (
          <Table.Row key={`list-row-${index}`} onClick={() => editItem(index)}>
            {displayFields.map(({ code }, cellIndex) => (
              <TableCell key={`list-cell-${index}-${cellIndex}`}>
                {item[code]?.value?.text}
              </TableCell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

export default ListTableLayout
