import React, { useEffect, useState } from 'react'
import { Container, List, Label, Segment, Button, Form, Search, Grid } from 'semantic-ui-react'
import { Loading, FilterList } from '../../components'
import { useRouter } from '../../utils/hooks/useRouter'
import useListApplications from '../../utils/hooks/useListApplications'
import strings from '../../utils/constants'
import getDefaultUserRole from '../../utils/helpers/list/findUserRole'
import { useUserState } from '../../contexts/UserState'
import mapColumnsByRole from '../../utils/helpers/list/mapColumnsByRole'
import { ColumnDetails } from '../../utils/types'
import { USER_ROLES } from '../../utils/data'
import { Link } from 'react-router-dom'
import ApplicationsList from '../../components/List/ApplicationsList'
import { ApplicationList } from '../../utils/generated/graphql'

const ListWrapper: React.FC = () => {
  const { query, push, history, queryString, restoreKebabCaseKeys } = useRouter()
  const { type, userRole } = query
  const {
    userState: { templatePermissions },
  } = useUserState()
  const [columns, setColumns] = useState<ColumnDetails[]>([])
  const [searchText, setSearchText] = useState(query?.search)
  const [applicationsRows, setApplicationsRows] = useState<ApplicationList[] | undefined>()
  const { error, loading, applications } = useListApplications(query)

  useEffect(() => {
    if (templatePermissions) {
      if (!type || !userRole) redirectToDefault()
      else {
        setApplicationsRows(undefined)
        const columns = mapColumnsByRole(userRole as USER_ROLES)
        setColumns(columns)
      }
    }
  }, [templatePermissions, type, userRole])

  useEffect(() => {
    if (!loading && applications) {
      setApplicationsRows(applications)
    }
  }, [loading, applications])

  useEffect(() => {
    const newQuery = { ...query }
    if (searchText === '') delete newQuery.search
    else newQuery.search = searchText
    history.push({ search: queryString.stringify(restoreKebabCaseKeys(newQuery), { sort: false }) })
  }, [searchText])

  const redirectToDefault = () => {
    const redirectType = type || Object.keys(templatePermissions)[0]
    const redirectUserRole = userRole || getDefaultUserRole(templatePermissions, redirectType)
    if (redirectType && redirectUserRole)
      push(`/applications?type=${redirectType}&user-role=${redirectUserRole}`)
    else {
      // To-Do: Show 404 if no default found
    }
  }

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value)
  }

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
        <Grid columns={3} style={{ marginTop: '5px' }}>
          <Grid.Row>
            <Grid.Column width={3}>
              <Search
                // size="large"
                placeholder="Search Applications"
                onSearchChange={handleSearchChange}
                open={false}
                value={searchText}
              />
            </Grid.Column>
            <Grid.Column textAlign="left" verticalAlign="middle">
              <Button content={'Clear search'} onClick={() => setSearchText('')} />
            </Grid.Column>
            <Grid.Column textAlign="right" verticalAlign="middle" floated="right">
              <Button
                as={Link}
                to={`/application/new?type=${type}`}
                content={strings.BUTTON_APPLICATION_NEW}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      {columns && applicationsRows && (
        <ApplicationsList columns={columns} applications={applicationsRows} />
      )}
    </Container>
  )
}

export default ListWrapper
