import React from 'react'
import { Grid } from 'semantic-ui-react'
import { ReviewAction, ReviewSectionComponentProps } from '../../utils/types'
import { ReviewSectionProgressBar } from '../Sections/SectionProgress'

const ReviewSectionRowProgress: React.FC<ReviewSectionComponentProps> = ({
  action,
  section: { reviewProgress, reviewAndConsolidationProgress },
  isAssignedToCurrentUser,
}) => {
  const getContent = () => {
    const progressBarProps = { reviewProgress, reviewAndConsolidationProgress }

    switch (action) {
      case ReviewAction.canStartReview: {
        if (isAssignedToCurrentUser) return null
        return null
      }
      case ReviewAction.canView: {
        return <ReviewSectionProgressBar {...progressBarProps} />
      }
      case ReviewAction.canContinue: {
        if (isAssignedToCurrentUser) return <ReviewSectionProgressBar {...progressBarProps} />
        return null
      }
      case ReviewAction.canReReview: {
        return <ReviewSectionProgressBar {...progressBarProps} />
      }
      default:
        return null
    }
  }

  return <Grid.Column>{getContent()}</Grid.Column>
}

export default ReviewSectionRowProgress
