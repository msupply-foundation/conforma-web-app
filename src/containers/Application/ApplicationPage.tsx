import React, { useEffect, useState } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import ApplicationStep from './ApplicationStep'
import { ApplicationHeader, Loading } from '../../components'
import {
  Application,
  useGetApplicationQuery,
} from '../../utils/generated/graphql'
import { Container, Grid, Label, Segment } from 'semantic-ui-react'

const ApplicationPage: React.FC = () => {
  const [ applicationName, setName ] = useState('')
  const { query } = useRouter()
  const { mode, serialNumber } = query

  const { data, loading, error } = useGetApplicationQuery({
    variables: {
      serial: serialNumber as string,
    },
  })

  useEffect(() => {
    if (data && data.applications && data.applications.nodes) {
      if (data.applications.nodes.length > 1)
        console.log('More than one application returned. Only one expected!')

      const application = data.applications.nodes[0] as Application
      if (application) {
        setName(application.name as string)
      }
    }
  }, [data, error])

  return loading ? (
    <Loading />
  ) : serialNumber ? (
  <Segment.Group>
    <ApplicationHeader mode={mode} serialNumber={serialNumber} name={applicationName} />
    <Container>
      <Grid columns={2} stackable textAlign='center'>
        <Grid.Row>
          <Grid.Column>
            <Segment>Place holder for progress</Segment>
          </Grid.Column>
          <Grid.Column>
            <ApplicationStep/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
    </Segment.Group>
    ) : <Label content="Application can't be displayed"/>
}

export default ApplicationPage
