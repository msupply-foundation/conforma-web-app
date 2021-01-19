import React, { useEffect, useState } from 'react'
import {
  Container,
  Table,
  List,
  Label,
  Header,
  Progress,
  Message,
  Segment,
  Button,
} from 'semantic-ui-react'
import { Loading, FilterList } from '../../components'
import { useRouter } from '../../utils/hooks/useRouter'
import useListApplication from '../../utils/hooks/useListApplications'
import strings from '../../utils/constants'
import findUserRole from '../../utils/helpers/translations/findUserRole'
import { useUserState } from '../../contexts/UserState'
import mapColumnsByRole from '../../utils/helpers/translations/mapColumnsByRole'
import { ColumnDetails } from '../../utils/types'
import { USER_ROLES } from '../../utils/data'
import { useListState } from '../../contexts/ListState'
import { Link } from 'react-router-dom'
import messages from '../../utils/messages'

const ApplicationList: React.FC = () => {
  const { query, push } = useRouter()
  const { type, userRole } = query
  const urlFilters = query
  const {
    userState: { templatePermissions },
  } = useUserState()
  const [columns, setColumns] = useState<ColumnDetails[]>([])
  const {
    listState: { applications },
    setListState,
  } = useListState()

  const { error, loading } = useListApplication({ urlFilters, type, setListState })

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
        setListState({ type: 'reset' })
        const columns = mapColumnsByRole(userRole as USER_ROLES)
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
      {!userRole ? (
        <Message color="red" header={messages.APPLICATIONS_MISSING_USER_ROLE} />
      ) : (
        columns &&
        applications && (
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
        )
      )}
      {applications && applications.length === 0 && (
        <Message floating color="yellow" header={messages.APPLICATIONS_LIST_EMPTY} />
      )}
    </Container>
  )
}

export default ApplicationList
