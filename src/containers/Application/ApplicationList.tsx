import React, { useEffect, useState } from 'react'
import { Container, Table, List, Label } from 'semantic-ui-react'
import { Loading, FilterList } from '../../components'
import { useRouter } from '../../utils/hooks/useRouter'
import useListApplication from '../../utils/hooks/useListApplications'
import strings from '../../utils/constants'
import findUserRole from '../../utils/helpers/translations/findUserRole'
import { useUserState } from '../../contexts/UserState'
import mapColumnsByRole from '../../utils/helpers/translations/mapColumnsByRole'
import USER_ROLE from '../../utils/model/userRole'
import { ColumnDetails } from '../../utils/types'

const DefaultCell: React.FC<any> = ({}) => {
  return <p>Test</p>
}

const ApplicationList: React.FC = () => {
  const { query, push } = useRouter()
  const { type, userRole } = query
  const {
    userState: { templatePermissions },
  } = useUserState()
  const [columns, setColumns] = useState<ColumnDetails[]>([])

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
        const columns = mapColumnsByRole(userRole as USER_ROLE)
        setColumns(columns)
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
      {userRole && columns && applications && applications.length > 0 && (
        // TODO: Create function on click (of a pre-defined group of sortable columns) in the header.
        // After a click on the header the URL updates and a new query to GraphQL using sorted columns
        <Table sortable stackable selectable>
          <Table.Header>
            <Table.Row>
              {columns.map(({ headerName }) => (
                <Table.HeaderCell key={`ApplicationList-header-${headerName}`}>
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
      )}
    </Container>
  )
}

export default ApplicationList
