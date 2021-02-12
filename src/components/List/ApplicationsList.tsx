import React from 'react'
import { Table, Message } from 'semantic-ui-react'
import { ApplicationList } from '../../utils/generated/graphql'
import messages from '../../utils/messages'
import { ColumnDetails, SortQuery } from '../../utils/types'

interface ApplicationsListProps {
  columns: Array<ColumnDetails>
  applications: Array<ApplicationList>
  sortQuery: SortQuery
  handleSort: Function
}

const ApplicationsList: React.FC<ApplicationsListProps> = ({
  columns,
  applications,
  sortQuery: { sortColumn, sortDirection },
  handleSort,
}) => {
  return (
    // TODO: Create function on click (of a pre-defined group of sortable columns) in the header.
    // After a click on the header the URL updates and a new query to GraphQL using sorted columns
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
          {applications.map((application, index) => (
            <Table.Row key={`ApplicationList-application-${application.serial}`}>
              {columns.map(({ headerName, ColumnComponent }) => (
                <Table.Cell key={`ApplicationList-row${index}-${headerName}`}>
                  <ColumnComponent application={application} />
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {applications && applications.length === 0 && (
        <Message floating color="yellow" header={messages.APPLICATIONS_LIST_EMPTY} />
      )}
    </>
  )
}

export default ApplicationsList
