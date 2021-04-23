import React from 'react'
import { Grid } from 'semantic-ui-react'
import { ReviewAction, ReviewSectionComponentProps } from '../../utils/types'
import { SectionProgressBar } from './SectionProgress'

const ReviewSectionRowProgress: React.FC<ReviewSectionComponentProps> = ({
  action,
  section: { reviewProgress },
  isAssignedToCurrentUser,
}) => {
  const getContent = () => {
    switch (action) {
      case ReviewAction.canStartReview: {
        if (isAssignedToCurrentUser) return null
        return null
      }
      case ReviewAction.canView: {
        return <SectionProgressBar reviewProgress={reviewProgress} />
      }
      case ReviewAction.canContinue: {
        if (isAssignedToCurrentUser) return <SectionProgressBar reviewProgress={reviewProgress} />
        return null
      }
      case ReviewAction.canReReview: {
        return <SectionProgressBar reviewProgress={reviewProgress} />
      }
      default:
        return null
    }
  }

  return <Grid.Column>{getContent()}</Grid.Column>
}

export default ReviewSectionRowProgress
