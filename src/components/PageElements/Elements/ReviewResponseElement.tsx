import React from 'react'
import { Icon, Grid, Button } from 'semantic-ui-react'
import { ApplicationResponse, ReviewResponse } from '../../../utils/generated/graphql'
import { ElementDecisionLabel } from '../../Review'

interface ReviewResponseElementProps {
  isCurrentReview: boolean
  isConsolidation: boolean
  applicationResponse: ApplicationResponse
  reviewResponse: ReviewResponse
  originalReviewResponse?: ReviewResponse
  isActiveEdit?: boolean
  setIsActiveEdit?: Function
}

const ReviewResponseElement: React.FC<ReviewResponseElementProps> = ({
  isCurrentReview,
  isConsolidation,
  reviewResponse,
  originalReviewResponse,
  children,
  isActiveEdit,
  setIsActiveEdit,
}) => {
  if (!reviewResponse) return null
  if (!reviewResponse?.decision) return null

  const backgroudColour = isCurrentReview ? 'changeable-background' : ''

  if (isActiveEdit) return <ReviewInlineEntry setIsActiveEdit={setIsActiveEdit} />

  return (
    <div className={`review-comment-area ${backgroudColour}`}>
      <Grid columns="equal" className="element-grid">
        <Grid.Column width={2} textAlign="left">
          {reviewResponse.review?.reviewer?.firstName} {reviewResponse.review?.reviewer?.lastName}
        </Grid.Column>
        <Grid.Column width={12} textAlign="left">
          <ElementDecisionLabel
            isCurrentReview={isCurrentReview}
            isConsolidation={isConsolidation}
            reviewResponse={reviewResponse}
            originalReviewResponse={originalReviewResponse}
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

const ReviewInlineEntry: React.FC<any> = ({ setIsActiveEdit }) => {
  return <Button content="Toggle editable review" onClick={() => setIsActiveEdit(false)} />
}
