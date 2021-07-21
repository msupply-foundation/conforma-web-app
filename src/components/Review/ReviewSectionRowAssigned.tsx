import React from 'react'
import { Grid } from 'semantic-ui-react'
import strings from '../../utils/constants'
import { ReviewStatus } from '../../utils/generated/graphql'
import { ReviewAction, ReviewSectionComponentProps } from '../../utils/types'
import {
  ReviewLabel,
  ReviewLockedLabel,
  ReviewSelfAssignmentLabel,
  ReviewInProgressLabel,
} from './ReviewLabel'

const ReviewSectionRowAssigned: React.FC<ReviewSectionComponentProps> = ({
  isAssignedToCurrentUser,
  thisReview,
  action,
  assignment,
}) => {
  const getLabel = () => {
    switch (action) {
      case ReviewAction.canSelfAssign:
        return isAssignedToCurrentUser ? (
          <ReviewSelfAssignmentLabel />
        ) : (
          <ReviewSelfAssignmentLabel reviewer={assignment.reviewer} />
        )
      case ReviewAction.canSelfAssignLocked:
      case ReviewAction.canContinueLocked:
        return isAssignedToCurrentUser ? (
          <ReviewLockedLabel />
        ) : (
          <ReviewLockedLabel reviewer={assignment.reviewer} />
        )
      case ReviewAction.canView:
        return isAssignedToCurrentUser ? (
          thisReview?.current.reviewStatus === ReviewStatus.Submitted ? (
            <ReviewLabel
              message={`${strings.REVIEW_SUBMITTED_BY} ${strings.REVIEW_FILTER_YOURSELF}`}
            />
          ) : (
            <ReviewLabel message={strings.REVIEW_NOT_READY} />
          )
        ) : (
          <ReviewLabel message={`${strings.REVIEW_SUBMITTED_BY} `} reviewer={assignment.reviewer} />
        )
      default:
        return isAssignedToCurrentUser ? (
          <ReviewInProgressLabel />
        ) : (
          <ReviewInProgressLabel reviewer={assignment.reviewer} />
        )
    }
  }
  return <Grid.Column className="padding-zero">{getLabel()}</Grid.Column>
}

export default ReviewSectionRowAssigned
