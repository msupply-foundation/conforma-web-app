import React, { Fragment } from 'react'
import { Table, Message } from 'semantic-ui-react'
import { ApplicationList } from '../../utils/generated/graphql'
import messages from '../../utils/messages'
import { Applications, ColumnDetails, SortQuery } from '../../utils/types'
import Loading from '../Loading'
import Sections from './Sections'

interface ApplicationsListProps {
  columns: Array<ColumnDetails>
  applications: Applications
  sortQuery: SortQuery
  handleSort: Function
  handleExpansion: (serialNumber: string) => void
  loading: boolean
  reload: boolean
}

const ApplicationsList: React.FC<ApplicationsListProps> = ({
  columns,
  applications,
  sortQuery: { sortColumn, sortDirection },
  handleSort,
  handleExpansion,
  loading,
  reload,
}) => {
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
            (applications || reload) &&
            applications.map(({ application, expanded }, index) => {
              const rowProps = {
                columns,
                application,
                index,
                handleExpansion,
              }
              const sectionsProps = {
                application,
                colSpan: columns.length + 1,
              }
              return (
                <Fragment key={`ApplicationList-application-${index}`}>
                  <ApplicationRow {...rowProps} />
                  {expanded && <SectionsExpandedRow {...sectionsProps} />}
                </Fragment>
              )
            })
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

interface ApplicationRowProps {
  columns: Array<ColumnDetails>
  application: ApplicationList
  index: number
  handleExpansion: (serialNumber: string) => void
}

const ApplicationRow: React.FC<ApplicationRowProps> = ({
  columns,
  application,
  index,
  handleExpansion,
}) => {
  const { serial } = application
  return (
    <Table.Row
      key={`ApplicationList-application-${serial}`}
      onClick={() => handleExpansion(serial as string)}
    >
      {columns.map(({ headerName, ColumnComponent }) => (
        <Table.Cell key={`ApplicationList-row-${index}-${headerName}`}>
          <ColumnComponent application={application} />
        </Table.Cell>
      ))}
      <Table.Cell icon="angle down" collapsing />
    </Table.Row>
  )
}

interface SectionsExpandedRowProps {
  application: ApplicationList
  colSpan: number
}

const SectionsExpandedRow: React.FC<SectionsExpandedRowProps> = ({ application, colSpan }) => {
  const { serial } = application
  return (
    <Table.Row key={`ApplicationList-application-${serial}-sections`} colSpan={colSpan}>
      <Table.Cell colSpan={colSpan}>
        <Sections />
      </Table.Cell>
    </Table.Row>
  )
}

export default ApplicationsList
