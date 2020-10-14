import React from 'react'
import { Container, Grid, Header, Segment } from 'semantic-ui-react'

export interface AppHederProps {
  serialNumber: string
  name: string
  mode?: string
}

const ApplicationHeader: React.FC<AppHederProps> = (props) => {
  const { mode, serialNumber, name } = props

  return (
    <Container>
      <Grid fluid columns={2} stackable textAlign='right'>
        <Grid.Row fluid>
          <Grid.Column>
            <Header as='h2' content={`${name}`}>
            </Header>
          </Grid.Column>
          <Grid.Column>
            <Header as='h3' content={`Number ${serialNumber}`}>
            </Header>
          </Grid.Column>
      </Grid.Row>
      </Grid>
      {mode && <Header as="h3" content={mode} />}
    </Container>
  )
}

export default ApplicationHeader
