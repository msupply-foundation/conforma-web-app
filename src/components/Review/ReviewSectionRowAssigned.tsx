import React from 'react'
import { Grid } from 'semantic-ui-react'
import { useLanguageProvider } from '../../contexts/Localisation'
import { ReviewStatus } from '../../utils/generated/graphql'
import { ReviewAction, ReviewSectionComponentProps } from '../../utils/types'
import {
  ReviewLabel,
  ReviewLockedLabel,
  ReviewSelfAssignmentLabel,
  ReviewInProgressLabel,
  ReviewCanMakeDecisionLabel,
} from './ReviewLabel'

const ReviewSectionRowAssigned: React.FC<ReviewSectionComponentProps> = ({
  reviewStructure: { assignment, thisReview },
  isAssignedToCurrentUser,
  action,
}) => {
  const { strings } = useLanguageProvider()
  const getLabel = () => {
    switch (action) {
      case ReviewAction.unknown:
        return null
      case ReviewAction.canMakeDecision:
        return isAssignedToCurrentUser ? (
          <ReviewCanMakeDecisionLabel strings={strings} />
        ) : (
          <ReviewCanMakeDecisionLabel reviewer={assignment?.assignee} strings={strings} />
        )
      case ReviewAction.canSelfAssign:
        return !isAssignedToCurrentUser ? (
          <ReviewSelfAssignmentLabel strings={strings} />
        ) : (
          <ReviewSelfAssignmentLabel reviewer={assignment?.assignee} strings={strings} />
        )
      case ReviewAction.canContinueLocked:
        return isAssignedToCurrentUser ? (
          <ReviewLockedLabel strings={strings} />
        ) : (
          <ReviewLockedLabel reviewer={assignment?.assignee} strings={strings} />
        )
      case ReviewAction.canView:
        return isAssignedToCurrentUser ? (
          thisReview?.current.reviewStatus === ReviewStatus.Submitted ? (
            <ReviewLabel
              message={`${strings.REVIEW_SUBMITTED_BY} ${strings.ASSIGNMENT_YOURSELF}`}
              strings={strings}
            />
          ) : (
            <ReviewLabel message={strings.REVIEW_NOT_READY} strings={strings} />
          )
        ) : thisReview?.current.reviewStatus === ReviewStatus.Submitted ? (
          <ReviewLabel
            message={`${strings.REVIEW_SUBMITTED_BY} `}
            reviewer={assignment?.assignee}
            strings={strings}
          />
        ) : (
          <ReviewInProgressLabel reviewer={assignment?.assignee} strings={strings} />
        )
      default:
        return isAssignedToCurrentUser ? (
          <ReviewInProgressLabel strings={strings} />
        ) : (
          <ReviewInProgressLabel reviewer={assignment?.assignee} strings={strings} />
        )
    }
  }
  return (
    <Grid.Column className="assigned-column" width={5}>
      {getLabel()}
    </Grid.Column>
  )
}

export default ReviewSectionRowAssigned
