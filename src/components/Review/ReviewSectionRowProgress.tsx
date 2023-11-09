import React from 'react'
import { Grid } from 'semantic-ui-react'
import { ReviewAction, ReviewSectionComponentProps } from '../../utils/types'
import { ConsolidationSectionProgressBar, ReviewSectionProgressBar } from '../'
import { useViewport } from '../../contexts/ViewportState'

const ReviewSectionRowProgress: React.FC<ReviewSectionComponentProps> = ({
  action,
  section: { reviewProgress, consolidationProgress },
  isAssignedToCurrentUser,
  isConsolidation,
}) => {
  const { isMobile } = useViewport()

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

  const content = getContent()

  if (isMobile && !content) {
    return null
  }

  if (!isMobile && !content) {
    return <Grid.Column width={5} className="custom-assignment-grid-column"></Grid.Column>
  }

  return (
    <Grid.Column width={5} className="custom-assignment-grid-column">
      {content}
    </Grid.Column>
  )
}

export default ReviewSectionRowProgress
