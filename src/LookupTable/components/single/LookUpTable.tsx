import React, { useEffect } from 'react'
import { Header, Message, Table } from 'semantic-ui-react'
import { Loading } from '../../../components'
import { useGetSingleTable } from '../../hooks'
import { FieldMapType } from '../../types'
import { toCamelCase } from '../../utils'

const LookupTable: React.FC<any> = ({ structure }) => {
  const { singleTableLoadState, lookupTable, setStructure }: any = useGetSingleTable()

  useEffect(() => {
    setStructure(structure)
  }, [structure])

  const { loading, called, error } = singleTableLoadState

  return error ? (
    <Message error header={'Error loading lookup-table'} list={[error.message]} />
  ) : loading || !called || !lookupTable ? (
    <Loading />
  ) : (
    <Table sortable stackable selectable>
      <Table.Header>
        <Table.Row>
          {structure.fieldMap.map((field: FieldMapType) => (
            <Table.HeaderCell
              key={`lookup-table-${structure.label}-header-${field.fieldname}`}
              colSpan={1}
            >
              {field.label}
            </Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {lookupTable && lookupTable.length > 0 ? (
          (lookupTable as any).map((myDataRow: any) => {
            return (
              <Table.Row key={`lookup-table-${structure.tableName}-row-${myDataRow.id}`}>
                {structure &&
                  structure.fieldMap.map((field: FieldMapType) => (
                    <Table.Cell key={`lookup-table-${structure.tableName}-data-${field.fieldname}`}>
                      {myDataRow[toCamelCase(field.fieldname)]}
                    </Table.Cell>
                  ))}
              </Table.Row>
            )
          })
        ) : (
          <Table.Row key={`lookup-table-${structure.tableName}-row-error`}>
            <Table.Cell>
              <Header as="h5" icon="exclamation circle" content="No data found!" />
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  )
}

export default LookupTable
