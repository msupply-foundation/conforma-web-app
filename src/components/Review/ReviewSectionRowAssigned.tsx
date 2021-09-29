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
} from './ReviewLabel'

const ReviewSectionRowAssigned: React.FC<ReviewSectionComponentProps> = ({
  isAssignedToCurrentUser,
  thisReview,
  action,
  assignment,
}) => {
  const { strings } = useLanguageProvider()
  const getLabel = () => {
    switch (action) {
      case ReviewAction.unknown:
        return null
      case ReviewAction.canSelfAssign:
      case ReviewAction.canMakeDecision:
        return isAssignedToCurrentUser ? (
          <ReviewSelfAssignmentLabel strings={strings} />
        ) : (
          <ReviewSelfAssignmentLabel reviewer={assignment.reviewer} strings={strings} />
        )
      case ReviewAction.canSelfAssignLocked:
      case ReviewAction.canContinueLocked:
        return isAssignedToCurrentUser ? (
          <ReviewLockedLabel strings={strings} />
        ) : (
          <ReviewLockedLabel reviewer={assignment.reviewer} strings={strings} />
        )
      case ReviewAction.canView:
        return isAssignedToCurrentUser ? (
          thisReview?.current.reviewStatus === ReviewStatus.Submitted ? (
            <ReviewLabel
              message={`${strings.REVIEW_SUBMITTED_BY} ${strings.REVIEW_FILTER_YOURSELF}`}
              strings={strings}
            />
          ) : (
            <ReviewLabel message={strings.REVIEW_NOT_READY} strings={strings} />
          )
        ) : thisReview?.current.reviewStatus === ReviewStatus.Submitted ? (
          <ReviewLabel
            message={`${strings.REVIEW_SUBMITTED_BY} `}
            reviewer={assignment.reviewer}
            strings={strings}
          />
        ) : (
          <ReviewInProgressLabel reviewer={assignment.reviewer} strings={strings} />
        )
      default:
        return isAssignedToCurrentUser ? (
          <ReviewInProgressLabel strings={strings} />
        ) : (
          <ReviewInProgressLabel reviewer={assignment.reviewer} strings={strings} />
        )
    }
  }
  return <Grid.Column className="assigned-column">{getLabel()}</Grid.Column>
}

export default ReviewSectionRowAssigned
