import React from 'react'
import { Link } from 'react-router-dom'
import { Grid, Icon, Label, Progress, Segment } from 'semantic-ui-react'
import { ApplicationStatus } from '../../utils/generated/graphql'
import { CellProps } from '../../utils/types'

enum ACTIONS {
  EDIT_DRAFT = 'Edit draft',
  MAKE_CHANGES = 'Make changes',
  RENEW = 'Renew',
}

const StatusCell: React.FC<CellProps> = ({ application }) => {
  const { serial, status } = application
  switch (status) {
    case ApplicationStatus.Completed:
    case ApplicationStatus.Submitted:
    case ApplicationStatus.ReSubmitted:
      return null
    case ApplicationStatus.Draft:
      return (
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Progress size="tiny" />
            </Grid.Column>
            <Grid.Column width={4}>
              <Link to={`/application/${serial}/summary`}>{ACTIONS.EDIT_DRAFT}</Link>
            </Grid.Column>
            <Grid.Column width={4}>
              <Icon name="trash alternate outline" />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )
    case ApplicationStatus.Expired:
      return <Link to={`/application/${serial}/renew`}>{ACTIONS.RENEW}</Link> // TODO: Add Renew page (and logic)
    case ApplicationStatus.ChangesRequired:
      return <Link to={`/application/${serial}`}>{ACTIONS.MAKE_CHANGES}</Link> // TODO: Show number of responses to make changes
  }
  return <Label>{application.status}</Label>
}

export default StatusCell
