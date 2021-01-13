import React, { useEffect } from 'react'
import { Container, Table, List, Label } from 'semantic-ui-react'
import { Loading, FilterList } from '../../components'
import { useRouter } from '../../utils/hooks/useRouter'
import { Link } from 'react-router-dom'
import useListApplication from '../../utils/hooks/useListApplications'
import strings from '../../utils/constants'
import findUserRole from '../../utils/helpers/translations/findUserRole'
import { useUserState } from '../../contexts/UserState'

const ApplicationList: React.FC = () => {
  const { query, push } = useRouter()
  const { type, userRole } = query
  const {
    userState: { templatePermissions },
  } = useUserState()
  const { error, loading, applications } = useListApplication({ type })

  useEffect(() => {
    if (type && !userRole) {
      const found = Object.entries(templatePermissions).find(([template]) => template === type)
      if (found) {
        const [template, permissions] = found
        const newRole = findUserRole(permissions)
        // TODO: Call helper to build similar URL query with the new userRole
        if (newRole) push(`/applications?type=${type}&user-role=${newRole}`)
      }
    }
  }, [type, userRole])

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
          <List.Item key={`app_selected_parameter_${value}`} content={key + ' : ' + value} />
        ))}
      </List>
      {userRole && applications && applications.length > 0 && (
        // TODO: Implement sortable columns -> Requires reducer
        <Table sortable stackable selectable>
          <Table.Header>
            <Table.Row>
              {Object.entries(applications[0]).map(([key]) => (
                <Table.HeaderCell key={`app_header_${key}`}>{key}</Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {applications.map((application, index) => (
              <Table.Row key={`${application.serial}`}>
                {Object.entries(application).map(([key, value]) => {
                  switch (key) {
                    case 'name':
                      return (
                        <Table.Cell key={`app_row_${index}_${key}`}>
                          <Link to={`/application/${application.serial}`}>{value}</Link>
                        </Table.Cell>
                      )
                    default:
                      return <Table.Cell key={`app_row_${index}_${key}`}>{value}</Table.Cell>
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
