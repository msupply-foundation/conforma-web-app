import React from 'react'

import { useQuery } from '@apollo/client'
import { Message, Header, Table } from 'semantic-ui-react'
import { Loading } from '../../components'
import strings from '../../utils/constants'
import { useRouter } from '../../utils/hooks/useRouter'
import { ApplicationLinkQuery } from '../../utils/types'
import { Link } from 'react-router-dom'

const ApplicationLinks: React.FC<{ applicationLinkQuery: ApplicationLinkQuery; id: number }> = ({
  applicationLinkQuery,
  id,
}) => {
  const { push } = useRouter()

  const { data, error } = useQuery(applicationLinkQuery.query, {
    variables: { id },
    fetchPolicy: 'network-only',
  })

  // if (error) return <Message error title={strings.ERROR_GENERIC} list={[error.message]} />
  // Silently ignore errors for demo
  if (error) return null
  if (!data) return <Loading />

  const applications = applicationLinkQuery.getApplications(data)
  if (applications.length === 0) return null

  return (
    <>
      <Header as="h4">Linked Applications</Header>
      <div id="list-container">
        <Table sortable stackable selectable>
          <Table.Header>
            <Table.Row>
              {Object.keys(applications[0]).map((columnName) => (
                <Table.HeaderCell key={columnName} colSpan={1}>
                  {columnName}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {applications.map((row, index) => (
              <Table.Row key={index}>
                {Object.values(row).map((value, index) => (
                  <Table.Cell key={index}>
                    <Link to={`/application/${row.serial}`} target="_blank">
                      {value}
                    </Link>
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </>
  )
}

export default ApplicationLinks
