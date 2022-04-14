import React from 'react'
import { Grid } from 'semantic-ui-react'
import { ReviewAction, ReviewSectionComponentProps } from '../../utils/types'
import { ConsolidationSectionProgressBar, ReviewSectionProgressBar } from '../'

const ReviewSectionRowProgress: React.FC<ReviewSectionComponentProps> = ({
  action,
  section: { reviewProgress, consolidationProgress },
  isAssignedToCurrentUser,
  isConsolidation,
}) => {
  const getContent = () => {
    switch (action) {
      case ReviewAction.canStartReview:
      case ReviewAction.canView:
        if (isAssignedToCurrentUser) {
          if (isConsolidation) {
            const totalDone =
              (consolidationProgress?.totalConform || 0) +
              (consolidationProgress?.totalNonConform || 0)
            if (totalDone > 0)
              return (
                <ConsolidationSectionProgressBar consolidationProgress={consolidationProgress} />
              )
          } else {
            const totalDone =
              (reviewProgress?.doneConform || 0) + (reviewProgress?.doneNonConform || 0)
            if (totalDone > 0) return <ReviewSectionProgressBar reviewProgress={reviewProgress} />
          }
        }
        return null
      case ReviewAction.canReReview:
        if (isConsolidation)
          return <ConsolidationSectionProgressBar consolidationProgress={consolidationProgress} />
        return <ReviewSectionProgressBar reviewProgress={reviewProgress} />
      case ReviewAction.canContinue:
        if (!isAssignedToCurrentUser) return null
        if (isConsolidation)
          return <ConsolidationSectionProgressBar consolidationProgress={consolidationProgress} />
        return <ReviewSectionProgressBar reviewProgress={reviewProgress} />

      default:
        return null
    }
  }

  return <Grid.Column width={5}>{getContent()}</Grid.Column>
}

export default ReviewSectionRowProgress
