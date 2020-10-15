import React from 'react'
import { Container, Grid, Header, Segment } from 'semantic-ui-react'

export interface AppHeaderProps {
  serialNumber: string
  name: string
  mode?: string
}

const ApplicationHeader: React.FC<AppHeaderProps> = (props) => {
  const { mode, serialNumber, name } = props

  return (
    <Container>
      <Grid columns={2} stackable textAlign='right'>
        <Grid.Row>
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
