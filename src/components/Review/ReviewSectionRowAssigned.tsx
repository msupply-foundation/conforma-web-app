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
  const { t } = useLanguageProvider()
  const getLabel = () => {
    switch (action) {
      case ReviewAction.unknown:
        return null
      case ReviewAction.canMakeDecision:
        return isAssignedToCurrentUser ? (
          <ReviewCanMakeDecisionLabel t={t} />
        ) : (
          <ReviewCanMakeDecisionLabel reviewer={assignment?.assignee} t={t} />
        )
      case ReviewAction.canSelfAssign:
        return !isAssignedToCurrentUser ? (
          <ReviewSelfAssignmentLabel t={t} />
        ) : (
          <ReviewSelfAssignmentLabel reviewer={assignment?.assignee} t={t} />
        )
      case ReviewAction.canContinueLocked:
        return isAssignedToCurrentUser ? (
          <ReviewLockedLabel t={t} />
        ) : (
          <ReviewLockedLabel reviewer={assignment?.assignee} t={t} />
        )
      case ReviewAction.canView:
        return isAssignedToCurrentUser ? (
          thisReview?.current.reviewStatus === ReviewStatus.Submitted ? (
            <ReviewLabel
              message={`${t('REVIEW_SUBMITTED_BY')} ${t('ASSIGNMENT_YOURSELF')}`}
              t={t}
            />
          ) : (
            <ReviewLabel message={t('REVIEW_NOT_READY')} t={t} />
          )
        ) : thisReview?.current.reviewStatus === ReviewStatus.Submitted ? (
          <ReviewLabel
            message={`${t('REVIEW_SUBMITTED_BY')} `}
            reviewer={assignment?.assignee}
            t={t}
          />
        ) : (
          <ReviewInProgressLabel reviewer={assignment?.assignee} t={t} />
        )
      default:
        return isAssignedToCurrentUser ? (
          <ReviewInProgressLabel t={t} />
        ) : (
          <ReviewInProgressLabel reviewer={assignment?.assignee} t={t} />
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
