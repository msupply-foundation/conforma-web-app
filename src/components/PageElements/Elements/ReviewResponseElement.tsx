import React from 'react'
import { Icon, Grid } from 'semantic-ui-react'
import { ApplicationResponse, ReviewResponse } from '../../../utils/generated/graphql'
import { ElementDecisionLabel } from '../../Review'

interface ReviewResponseElementProps {
  isCurrentReview: boolean
  isConsolidation: boolean
  isNewApplicationResponse: boolean
  applicationResponse: ApplicationResponse
  reviewResponse: ReviewResponse
  originalReviewResponse?: ReviewResponse
}

const ReviewResponseElement: React.FC<ReviewResponseElementProps> = ({
  isCurrentReview,
  reviewResponse,
  children,
  ...props
}) => {
  if (!reviewResponse) return null
  if (!reviewResponse?.decision) return null

  // After review is submitted, reviewResponses are trimmed if they are not changed duplicates
  // or if they are null, we only want to show reviewResponses that are linked to latestApplicationResponse
  if (
    !props.isConsolidation &&
    props.applicationResponse.id !== reviewResponse.applicationResponse?.id
  )
    return null

  // console.log(
  //   'isConsolidation',
  //   isConsolidation,
  //   props.originalReviewResponse?.id,
  //   reviewResponse.reviewResponseLinkId
  // )

  // After consolidation is submitted, reviewResponses are trimmed if they are not changed duplicates
  // or if they are null, we only want to show reviewResponses that are linked to latestOriginalReviewResponse - from reviewer
  if (
    props.isConsolidation &&
    props.originalReviewResponse?.id !== reviewResponse.reviewResponseLinkId
  )
    return null

  const backgroudColour = isCurrentReview ? 'changeable-background' : ''

  return (
    <div className={`review-comment-area ${backgroudColour}`}>
      <Grid columns="equal" className="review-comment-grid">
        <Grid.Column width={2} textAlign="left">
          {reviewResponse.review?.reviewer?.firstName} {reviewResponse.review?.reviewer?.lastName}
        </Grid.Column>
        <Grid.Column width={12} textAlign="left">
          <ElementDecisionLabel
            isCurrentReview={isCurrentReview}
            reviewResponse={reviewResponse}
            {...props}
          />
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

export default ReviewResponseElement
