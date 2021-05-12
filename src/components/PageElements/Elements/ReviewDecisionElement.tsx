import React from 'react'
import { Icon, Grid } from 'semantic-ui-react'
import { ReviewElementProps } from '../../../utils/types'
import { ElementDecisionLabel } from '../../Review'

type ReviewDecisionElementProps = ReviewElementProps & { isActiveReview: boolean }
const ReviewDecisionElement: React.FC<ReviewDecisionElementProps> = ({
  children,
  isActiveReview,
  ...props
}) => {
  const { reviewResponse, isConsolidation } = props
  if (!reviewResponse) return null
  if (!reviewResponse?.decision) return null

  // After review is submitted, reviewResponses are trimmed if they are not changed duplicates
  // or if they are null, we only want to show reviewResponses that are linked to latestApplicationResponse
  if (!isConsolidation && props.applicationResponse.id !== reviewResponse.applicationResponse?.id)
    return null

  // After consolidation is submitted, reviewResponses are trimmed if they are not changed duplicates
  // or if they are null, we only want to show reviewResponses that are linked to latestOriginalReviewResponse - from reviewer
  if (isConsolidation && props.originalReviewResponse?.id !== reviewResponse.reviewResponseLinkId)
    return null

  const backgroudColour = isActiveReview ? 'changeable-background' : ''

  return (
    <div className={`review-comment-area ${backgroudColour}`}>
      <Grid columns="equal" className="review-comment-grid">
        <Grid.Column width={2} textAlign="left">
          {reviewResponse.review?.reviewer?.firstName} {reviewResponse.review?.reviewer?.lastName}
        </Grid.Column>
        <Grid.Column width={12} textAlign="left">
          <ElementDecisionLabel isActiveReview={isActiveReview} {...props} />
          {!reviewResponse.comment ? null : (
            <div>
              <Icon name="comment alternate outline" color="grey" />
              {reviewResponse.comment}
            </div>
          )}
        </Grid.Column>
        <Grid.Column textAlign="right" width={2}>
          {children}
        </Grid.Column>
      </Grid>
    </div>
  )
}

export default ReviewDecisionElement
