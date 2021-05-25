import React from 'react'
import { Grid } from 'semantic-ui-react'
import {
  ChangeRequestsProgress,
  ReviewAction,
  ReviewProgress,
  ReviewSectionComponentProps,
} from '../../utils/types'
import { ConsolidationSectionProgressBar, ReviewSectionProgressBar } from '../'

const ReviewSectionRowProgress: React.FC<ReviewSectionComponentProps> = ({
  action,
  section: { reviewProgress, consolidationProgress, changeRequestsProgress },
  isAssignedToCurrentUser,
  isConsolidation,
}) => {
  const getContent = () => {
    switch (action) {
      case ReviewAction.canStartReview: {
        return null
      }
      case ReviewAction.canView:
      case ReviewAction.canReReview:
        if (isConsolidation)
          return <ConsolidationSectionProgressBar consolidationProgress={consolidationProgress} />
        return (
          <ReviewSectionProgressBar
            reviewProgress={reviewProgress as ReviewProgress & ChangeRequestsProgress}
          />
        )
      case ReviewAction.canContinue:
        if (!isAssignedToCurrentUser) return null
        if (isConsolidation)
          return <ConsolidationSectionProgressBar consolidationProgress={consolidationProgress} />
        return (
          <ReviewSectionProgressBar
            reviewProgress={reviewProgress as ReviewProgress & ChangeRequestsProgress}
          />
        )
      default:
        return null
    }
  }

  return <Grid.Column>{getContent()}</Grid.Column>
}

export default ReviewSectionRowProgress
