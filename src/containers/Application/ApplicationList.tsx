import React, { useEffect, useState } from 'react'
import { Container, Table, List, Label, Header, Progress } from 'semantic-ui-react'
import { Loading, FilterList } from '../../components'
import { useRouter } from '../../utils/hooks/useRouter'
import { Link } from 'react-router-dom'
import useListApplication from '../../utils/hooks/useListApplications'
import strings from '../../utils/constants'
import findUserRole from '../../utils/helpers/translations/findUserRole'
import { useUserState } from '../../contexts/UserState'
import mapColumnsByRole, {
  APPLICATION_COLUMN,
} from '../../utils/helpers/translations/mapColumnsByRole'

const ApplicationList: React.FC = () => {
  const { query, push } = useRouter()
  const { type, userRole } = query
  const {
    userState: { templatePermissions },
  } = useUserState()
  const [headers, setHeaders] = useState<string[]>()

  const { error, loading, applications } = useListApplication({ type })

  useEffect(() => {
    if (type && templatePermissions) {
      if (!userRole) {
        const found = Object.entries(templatePermissions).find(([template]) => template === type)
        if (found) {
          const [template, permissions] = found
          const newRole = findUserRole(permissions)
          // TODO: Call helper to build similar URL query with the new userRole
          if (newRole) push(`/applications?type=${type}&user-role=${newRole}`)
        }
      } else {
        const columns = mapColumnsByRole(userRole)
        setHeaders(columns.map(({ headerName }) => headerName))
      }
    }
  }, [type, userRole, templatePermissions])

  return error ? (
    <Label content={strings.ERROR_APPLICATIONS_LIST} error={error} />
  ) : loading ? (
    <Loading />
  ) : (
    <Container>
      <FilterList />
      {Object.keys(query).length > 0 && <h3>Query parameters:</h3>}
      <List>
        {Object.entries(query).map(([key, value]) => (
          <List.Item key={`ApplicationList-parameter-${value}`} content={key + ' : ' + value} />
        ))}
      </List>
      {userRole && headers && applications && applications.length > 0 && (
        // TODO: Create function on click (of a pre-defined group of sortable columns) in the header.
        // After a click on the header the URL updates and a new query to GraphQL using sorted columns
        <Table sortable stackable selectable>
          <Table.Header>
            <Table.Row>
              {headers.map((headerName) => (
                <Table.HeaderCell key={`ApplicationList-header-${headerName}`}>
                  {headerName}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {applications.map((application, index) => (
              <Table.Row key={`ApplicationList-application-${application.serial}`}>
                {headers.map((headerName) => {
                  // TODO: Move this to render property to be defined for each ColumnDetails in mapColumnsByRole
                  switch (headerName) {
                    case APPLICATION_COLUMN.LAST_ACTIVE_DATE:
                    case APPLICATION_COLUMN.DEADLINE_DATE:
                      return (
                        <Table.Cell key={`ApplicationList-row${index}-${headerName}`}>
                          <Header content={strings.DATE_APPLICATION_PLACEHOLDER} />
                        </Table.Cell>
                      )
                    case APPLICATION_COLUMN.APPLICATION_NAME:
                      return (
                        <Table.Cell key={`ApplicationList-row${index}-${headerName}`}>
                          <Link to={`/application/${application.serial}`}>{application.name}</Link>
                        </Table.Cell>
                      )
                    case APPLICATION_COLUMN.STAGE:
                      return (
                        <Table.Cell key={`ApplicationList-row${index}-${headerName}`}>
                          <Label>{application.stage}</Label>
                        </Table.Cell>
                      )
                    case APPLICATION_COLUMN.STATUS:
                      return (
                        <Table.Cell key={`ApplicationList-row${index}-${headerName}`}>
                          <Progress size="tiny" />
                        </Table.Cell>
                      )
                    default:
                      return (
                        <Table.Cell key={`ApplicationList-row${index}-${headerName}`}>
                          Problem
                        </Table.Cell>
                      )
                  }
                })}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  )
}

export default ApplicationList
