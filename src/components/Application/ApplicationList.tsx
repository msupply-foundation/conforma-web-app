import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { Container, Table, List } from 'semantic-ui-react'
import { Application } from '../../generated/graphql'
import getApplications from '../../graphql/queries/getApplications.query'
import Loading from '../Loading'
import FilterList from '../FilterList'
import ApplicationEdit from './ApplicationEdit'
import { useNavigationState } from '../../containers/Main/NavigationState'

const ApplicationList: React.FC = () => {
  const [applications, setApplications] = useState<Array<Application> | null>()
  const { data, loading, error } = useQuery(getApplications)
  const { navigationState, setNavigationState } = useNavigationState()
  const { queryParameters } = navigationState

  const [values, setValues] = useState({
    id: 0,
    name: '',
  })

  const editApplication = (applicationId: number, applicationName: string) => {
    setValues({
      ...values,
      id: applicationId,
      name: applicationName,
    })
  }

  useEffect(() => {
    if (data) {
      if (data && data.applications && data.applications.nodes) {
        setApplications(data.applications.nodes)
      }
    }
    if (error) {
      console.log(error)
    }
  }, [data, error])

  return loading ? (
    <Loading />
  ) : (
    <Container>
      <FilterList />
      {Object.keys(queryParameters).length > 0 && <h3>Query parameters:</h3>}
      <List>
        {Object.entries(queryParameters).map(([key, value]) => (
          <List.Item key={`app-selected-parameter-${value}`} content={key + ' : ' + value} />
        ))}
      </List>
      <Table sortable stackable selectable>
        <Table.Header>
          {applications &&
            applications.length > 0 &&
            Object.entries(applications[0]).map(([key, value]) =>
              key === 'template' ? (
                Object.entries(value as object).map(([childKey]) => (
                  <Table.HeaderCell key={`app_header_${childKey}`}>{childKey}</Table.HeaderCell>
                ))
              ) : (
                <Table.HeaderCell key={`app_header_${key}`}>{key}</Table.HeaderCell>
              )
            )}
        </Table.Header>
        <Table.Body>
          {applications &&
            applications.length > 0 &&
            applications.map((application: Application, index: number) => (
              <Table.Row
                onClick={() => editApplication(application.id, application.name as string)}
                key={application.id}
              >
                {Object.values(application).map((value) =>
                  typeof value === 'object' ? (
                    Object.values(value as object).map((property) => (
                      <Table.Cell key={`app_${index}_${property}`}>{property}</Table.Cell>
                    ))
                  ) : (
                    <Table.Cell key={`app_${index}_${value}`}>{value}</Table.Cell>
                  )
                )}
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
      <ApplicationEdit id={values.id} name={values.name} />
    </Container>
  )
}

export default ApplicationList
