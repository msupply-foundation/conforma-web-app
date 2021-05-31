import React from 'react'
import { Icon } from 'semantic-ui-react'
import { ReviewResponse } from '../../../utils/generated/graphql'
import { ElementDecisionLabel } from '../../Review'

interface ReviewResponseElementProps {
  isCurrentReview: boolean
  isConsolidation: boolean
  isDecisionVisible?: boolean
  shouldDim?: boolean
  reviewResponse: ReviewResponse
}

const ReviewResponseElement: React.FC<ReviewResponseElementProps> = ({
  isCurrentReview,
  isConsolidation,
  isDecisionVisible = true,
  shouldDim = false,
  reviewResponse,
  children,
}) => {
  const backgroundClass = isCurrentReview ? 'changeable-background' : ''
  const dimClass = shouldDim ? 'dim' : ''

  const canReviewerEdit = (isCurrentReview && !!reviewResponse?.comment) as boolean

  return (
    <div className={`response-container ${backgroundClass} ${dimClass}`}>
      <div className="review-response-content ">
        <ElementDecisionLabel
          isConsolidation={isConsolidation}
          reviewResponse={reviewResponse}
          isDecisionVisible={isDecisionVisible}
        />
        <div className="comment-container">
          {canReviewerEdit ? <Icon name="comment alternate outline" color="grey" /> : null}
          <p className="secondary">{reviewResponse.comment}</p>
        </div>
      </div>

      <div className="action-container">{children}</div>
    </div>
  )
}

export default ReviewResponseElement
