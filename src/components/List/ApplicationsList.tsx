import React, { Fragment } from 'react'
import { Table, Message, Popup } from 'semantic-ui-react'
import { useLanguageProvider } from '../../contexts/Localisation'
import { ApplicationStatus, useDeleteApplicationMutation } from '../../utils/generated/graphql'
import { ApplicationListRow, ColumnDetails, SortQuery } from '../../utils/types'
import Loading from '../Loading'
import { TableCellMobileLabelWrapper } from '../../utils/tables/TableCellMobileLabelWrapper'
import { useViewport } from '../../contexts/ViewportState'
import { ReviewerActionCell } from './Cells'

interface ApplicationsListProps {
  columns: ColumnDetails[]
  applications: ApplicationListRow[]
  sortQuery: SortQuery
  handleSort: Function
  loading: boolean
  refetch: Function
}

const ApplicationsList: React.FC<ApplicationsListProps> = ({
  columns,
  applications,
  sortQuery: { sortColumn, sortDirection },
  handleSort,
  loading,
  refetch,
}) => {
  const { t } = useLanguageProvider()
  const { isMobile } = useViewport()
  return (
    <div id="applications-list">
      <Table sortable stackable selectable>
        {!isMobile && (
          <Table.Header>
            <Table.Row>
              {columns.map(({ headerName, headerDetail, sortName }, index) => (
                <Table.HeaderCell
                  key={`ApplicationList-header-${headerName}-${index}`}
                  sorted={sortName && sortColumn === sortName ? sortDirection : undefined}
                  onClick={() => handleSort(sortName)}
                  colSpan={index === columns.length - 1 ? 2 : 1} // Set last column to fill last column (expansion)
                >
                  {headerDetail ? (
                    <Popup size="tiny" content={headerDetail} trigger={<span>{headerName}</span>} />
                  ) : (
                    headerName
                  )}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
        )}
        <Table.Body>
          {loading
            ? null
            : applications.map((application, index) => {
                const rowProps = {
                  refetch,
                  columns,
                  application,
                }
                return (
                  <Fragment key={`ApplicationList-application-${index}`}>
                    <ApplicationRow {...rowProps} />
                  </Fragment>
                )
              })}
        </Table.Body>
      </Table>
      {loading && <Loading />}
      {applications && applications.length === 0 && !loading && (
        <Message floating color="yellow" header={t('APPLICATIONS_LIST_EMPTY')} />
      )}
    </div>
  )
}

interface ApplicationRowProps {
  refetch: Function
  columns: ColumnDetails[]
  application: ApplicationListRow
}

const ApplicationRow: React.FC<ApplicationRowProps> = ({ refetch, columns, application }) => {
  const { t } = useLanguageProvider()
  const { isMobile } = useViewport()
  const [deleteApplication, { loading, error }] = useDeleteApplicationMutation({
    variables: { id: application.id || 0 },
    onCompleted: () => refetch(),
  })
  const props = {
    application,
    loading,
    deleteApplication,
  }

  if (error) return <Message error header={t('ERROR_APPLICATION_DELETE')} list={[error]} />

  return (
    <Table.Row
      key={`ApplicationList-application-${application.id}`}
      className="list-row"
      style={{ position: 'relative' }}
    >
      {columns.map(({ ColumnComponent, headerName, hideMobileLabel, hideOnMobileTest }, index) => {
        const rowData = application as Record<string, any>
        if (isMobile && hideOnMobileTest && hideOnMobileTest(rowData))
          return (
            <MobileListActionCell
              Component={<ColumnComponent {...props} application={application} />}
              {...props}
            />
          )
        return (
          <Table.Cell key={`ApplicationList-row-${application.id}-${index}`}>
            <TableCellMobileLabelWrapper label={headerName} hideLabel={hideMobileLabel}>
              <ColumnComponent {...props} />
            </TableCellMobileLabelWrapper>
            <MobileListActionCell
              Component={<ColumnComponent {...props} application={application} />}
              {...props}
            />
          </Table.Cell>
        )
      })}
    </Table.Row>
  )
}

export default ApplicationsList

const MobileListActionCell: React.FC<{ Component: any; application: ApplicationListRow }> = ({
  Component,
  application,
}) => {
  const { isMobile } = useViewport()
  if (!isMobile) return null

  if (
    (Component.type.displayName === 'ReviewerActionCell' && application.reviewerAction) ||
    (Component.type.displayName === 'ApplicantActionCell' &&
      (application.status === ApplicationStatus.ChangesRequired ||
        application.status === ApplicationStatus.Draft))
  )
    return <div style={{ position: 'absolute', top: '1em', right: '1em' }}>{Component}</div>

  return null
}
