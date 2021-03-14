import React from 'react'
import { Grid } from 'semantic-ui-react'
import strings from '../../utils/constants'
import { ReviewSectionComponentProps } from '../../utils/types'

const ReviewSectionRowAssigned: React.FC<ReviewSectionComponentProps> = ({
  isAssignedToCurrentUser,
  assignment,
}) => {
  if (isAssignedToCurrentUser) return <Grid.Column>{strings.ASSIGNED}</Grid.Column>
  const { lastName, firstName } = assignment.reviewer
  return <Grid.Column>{`${strings.ASSIGNED_TO} ${firstName} ${lastName}`}</Grid.Column>
}

export default ReviewSectionRowAssigned
