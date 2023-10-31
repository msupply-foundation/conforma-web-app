import React, { Fragment } from 'react'
import { Table, Message, Popup } from 'semantic-ui-react'
import { useLanguageProvider } from '../../contexts/Localisation'
import { useDeleteApplicationMutation } from '../../utils/generated/graphql'
import { ApplicationListRow, ColumnDetails, SortQuery } from '../../utils/types'
import Loading from '../Loading'
import { TableCellMobileLabelWrapper } from '../../utils/tables/TableCellMobileLabelWrapper'

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
  return (
    <>
      <Table sortable stackable selectable>
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
    </>
  )
}

interface ApplicationRowProps {
  refetch: Function
  columns: ColumnDetails[]
  application: ApplicationListRow
}

const ApplicationRow: React.FC<ApplicationRowProps> = ({ refetch, columns, application }) => {
  const { t } = useLanguageProvider()
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
    <Table.Row key={`ApplicationList-application-${application.id}`} className="list-row">
      {columns.map(({ ColumnComponent, headerName, hideMobileLabel, hideOnMobileTest }, index) => {
        const rowData = application as Record<string, any>
        return (
          <Table.Cell key={`ApplicationList-row-${application.id}-${index}`}>
            <TableCellMobileLabelWrapper
              label={headerName}
              rowData={rowData}
              hideLabel={hideMobileLabel}
              hideIf={hideOnMobileTest}
            >
              <ColumnComponent {...props} />
            </TableCellMobileLabelWrapper>
          </Table.Cell>
        )
      })}
    </Table.Row>
  )
}

export default ApplicationsList
