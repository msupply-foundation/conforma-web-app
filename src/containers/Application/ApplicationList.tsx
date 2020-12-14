import React from 'react'
import { Container, Table, List, Label } from 'semantic-ui-react'
import { Loading, FilterList } from '../../components'
import { useRouter } from '../../utils/hooks/useRouter'
import { Link } from 'react-router-dom'
import useListApplication from '../../utils/hooks/useListApplications'
import strings from '../../utils/constants'

const ApplicationList: React.FC = () => {
  const { query, pathname } = useRouter()
  const { error, loading, applications } = useListApplication()

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
      {applications && applications.length > 0 && (
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
