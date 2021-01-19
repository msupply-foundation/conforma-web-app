import React, { useEffect, useState } from 'react'
import { Container, List, Label, Segment, Button } from 'semantic-ui-react'
import { Loading, FilterList } from '../../components'
import { useRouter } from '../../utils/hooks/useRouter'
import useListApplications from '../../utils/hooks/useListApplications'
import strings from '../../utils/constants'
import findUserRole from '../../utils/helpers/translations/findUserRole'
import { useUserState } from '../../contexts/UserState'
import mapColumnsByRole from '../../utils/helpers/translations/mapColumnsByRole'
import { ApplicationDetails, ColumnDetails } from '../../utils/types'
import { USER_ROLES } from '../../utils/data'
import { Link } from 'react-router-dom'
import ApplicationsList from '../../components/List/ApplicationsList'

const ListWrapper: React.FC = () => {
  const { query, push } = useRouter()
  const { type, userRole } = query
  const {
    userState: { templatePermissions },
  } = useUserState()
  const [columns, setColumns] = useState<ColumnDetails[]>([])
  const [applicationsRows, setApplicationsRows] = useState<ApplicationDetails[] | undefined>()
  const { error, loading, applications } = useListApplications({ type })

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
        setApplicationsRows(undefined)
        const columns = mapColumnsByRole(userRole as USER_ROLES)
        setColumns(columns)
      }
    }
  }, [type, userRole, templatePermissions])

  useEffect(() => {
    if (!loading && applications) {
      setApplicationsRows(Object.values(applications))
    }
  }, [loading, applications])

  return error ? (
    <Label content={strings.ERROR_APPLICATIONS_LIST} error={error} />
  ) : loading ? (
    <Loading />
  ) : (
    <Container>
      <FilterList />
      <Segment vertical>
        {Object.keys(query).length > 0 && <h3>Query parameters:</h3>}
        <List>
          {Object.entries(query).map(([key, value]) => (
            <List.Item key={`ApplicationList-parameter-${value}`} content={key + ' : ' + value} />
          ))}
        </List>
        <Button
          as={Link}
          to={`/application/new?type=${type}`}
          content={strings.BUTTON_APPLICATION_NEW}
        />
      </Segment>
      {columns && applicationsRows && (
        <ApplicationsList columns={columns} applications={applicationsRows} />
      )}
    </Container>
  )
}

export default ListWrapper
