import React, { useEffect, useState } from 'react'
import { Table, Message, Segment } from 'semantic-ui-react'
import { ApplicationList } from '../../utils/generated/graphql'
import messages from '../../utils/messages'
import { ColumnDetails, SortQuery } from '../../utils/types'
import Loading from '../Loading'

interface ApplicationsListProps {
  columns: Array<ColumnDetails>
  applications: Array<ApplicationList>
  sortQuery: SortQuery
  handleSort: Function
  loading: boolean
}

const ApplicationsList: React.FC<ApplicationsListProps> = ({
  columns,
  applications,
  sortQuery: { sortColumn, sortDirection },
  handleSort,
  loading,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
  const handleClick = (index: number) => {
    if (expandedRows.has(index)) expandedRows.delete(index)
    else expandedRows.add(index)
    setExpandedRows(expandedRows)
  }

  useEffect(() => {
    console.log(expandedRows)
  }, [expandedRows])
  return (
    <>
      <Table sortable stackable selectable>
        <Table.Header>
          <Table.Row>
            {columns.map(({ headerName, sortName }) => (
              <Table.HeaderCell
                key={`ApplicationList-header-${headerName}`}
                sorted={sortName && sortColumn === sortName ? sortDirection : undefined}
                onClick={() => handleSort(sortName)}
              >
                {headerName}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row colSpan={columns.length} textAlign="center">
              <Table.Cell colSpan={columns.length} textAlign="center">
                <Loading />
              </Table.Cell>
            </Table.Row>
          ) : (
            applications.map((application, index) => (
              <>
                <Table.Row
                  key={`ApplicationList-application-${application.serial}`}
                  onClick={() => handleClick(index)}
                >
                  {columns.map(({ headerName, ColumnComponent }) => (
                    <Table.Cell key={`ApplicationList-row-${index}-${headerName}`}>
                      <ColumnComponent application={application} />
                    </Table.Cell>
                  ))}
                  <Table.Cell icon="angle down" />
                </Table.Row>
                <Table.Row
                  key={`ApplicationList-application-${application.serial}-sections`}
                  colSpan={columns.length}
                >
                  <Table.Cell colSpan={columns.length}>
                    <Segment color="grey" />
                  </Table.Cell>
                </Table.Row>
              </>
            ))
          )}
        </Table.Body>
      </Table>
      {loading && <Loading />}
      {applications && applications.length === 0 && (
        <Message floating color="yellow" header={messages.APPLICATIONS_LIST_EMPTY} />
      )}
    </>
  )
}

export default ApplicationsList
