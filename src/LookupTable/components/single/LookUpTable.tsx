import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { Header, Message, Table } from 'semantic-ui-react'
import { Loading } from '../../../components'
import { FieldMapType, LookUpTableType, TableStructureType } from '../../types'
import { withTableQueryBuilder } from '../hocs'
import { toCamelCase } from '../../utils'

const LookupTable: React.FC<TableStructureType> = (props) => {
  const { tableQuery, tableName, structure } = props

  const [lookupTable, setLookupTable] = useState()

  const { loading, error, data } = useQuery(tableQuery, {
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    if (!loading && !error && data[tableName]) {
      setLookupTable(data[tableName].nodes)
    }
  }, [loading, data])

  const buildLookupTable = (lookupTable: LookUpTableType[] | undefined) => {
    return lookupTable && lookupTable.length > 0 ? (
      (lookupTable as any).map((myDataRow: any) => {
        return (
          <Table.Row key={`lookup-table-${tableName}-row-${myDataRow.id}`}>
            {structure &&
              structure.fieldMap.map((field: FieldMapType) => (
                <Table.Cell key={`lookup-table-${tableName}-data-${field.fieldname}`}>
                  {myDataRow[toCamelCase(field.fieldname)]}
                </Table.Cell>
              ))}
          </Table.Row>
        )
      })
    ) : (
      <Table.Row key={`lookup-table-${tableName}-row-error`}>
        <Table.Cell>
          <Header as="h5" icon="exclamation circle" content="No data found!" />
        </Table.Cell>
      </Table.Row>
    )
  }

  return error ? (
    <Message error header={'Error loading lookup-table'} list={[error.message]} />
  ) : loading ? (
    <Loading />
  ) : (
    <Table sortable stackable selectable>
      <Table.Header>
        <Table.Row>
          {structure.fieldMap.map((field: FieldMapType) => (
            <Table.HeaderCell
              key={`lookup-table-${tableName}-header-${field.fieldname}`}
              colSpan={1}
            >
              {field.label}
            </Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>{buildLookupTable(lookupTable)}</Table.Body>
    </Table>
  )
}

export default withTableQueryBuilder(LookupTable)
