import React, { Fragment } from 'react'
import { Table, Message } from 'semantic-ui-react'
import { useLanguageProvider } from '../../contexts/Localisation'
import { ApplicationListRow, ColumnDetails, SortQuery } from '../../utils/types'
import Loading from '../Loading'

interface ApplicationsListProps {
  columns: Array<ColumnDetails>
  applications: ApplicationListRow[]
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
  const { strings } = useLanguageProvider()
  return (
    <>
      <Table sortable stackable selectable>
        <Table.Header>
          <Table.Row>
            {columns.map(({ headerName, sortName }, index) => (
              <Table.HeaderCell
                key={`ApplicationList-header-${headerName}-${index}`}
                sorted={sortName && sortColumn === sortName ? sortDirection : undefined}
                onClick={() => handleSort(sortName)}
                colSpan={index === columns.length - 1 ? 2 : 1} // Set last column to fill last column (expansion)
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
            applications.map((application, index) => {
              const rowProps = {
                index,
                columns,
                application,
              }
              return (
                <Fragment key={`ApplicationList-application-${index}`}>
                  <ApplicationRow {...rowProps} />
                </Fragment>
              )
            })
          )}
        </Table.Body>
      </Table>
      {loading && <Loading />}
      {applications && applications.length === 0 && (
        <Message floating color="yellow" header={strings.APPLICATIONS_LIST_EMPTY} />
      )}
    </>
  )
}

interface ApplicationRowProps {
  index: number
  columns: Array<ColumnDetails>
  application: ApplicationListRow
}

const ApplicationRow: React.FC<ApplicationRowProps> = ({ columns, application }) => {
  return (
    <Table.Row key={`ApplicationList-application-${application.id}`} className="list-row">
      {columns.map(({ headerName, ColumnComponent }, index) => (
        <Table.Cell key={`ApplicationList-row-${application.id}-${index}`}>
          <ColumnComponent application={application} />
        </Table.Cell>
      ))}
    </Table.Row>
  )
}

export default ApplicationsList
