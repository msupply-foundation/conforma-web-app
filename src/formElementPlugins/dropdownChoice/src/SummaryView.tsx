import React from 'react'
import { Grid, Header, Icon } from 'semantic-ui-react'
import { SummaryViewProps } from '../../types'

const SummaryView: React.FC<SummaryViewProps> = ({ parameters, response }) => {
  return (
    <Grid columns={2}>
      <Grid.Row>
        <Grid.Column floated="left" width={12}>
          <Header as="h3" content={parameters.label} />
          <p>{response?.text}</p>
        </Grid.Column>
        <Grid.Column floated="right" width={3}>
          {!response?.isValid ? <Icon name="exclamation circle" color="red" /> : null}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default SummaryView
