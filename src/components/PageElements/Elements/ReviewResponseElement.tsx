import React from 'react'
import { Icon } from 'semantic-ui-react'
import { ReviewResponse } from '../../../utils/generated/graphql'
import { ElementDecisionLabel } from '../../Review'

interface ReviewResponseElementProps {
  isCurrentReview: boolean
  isConsolidation: boolean
  shouldDim?: boolean
  shouldHideDecision?: boolean
  reviewResponse: ReviewResponse
}

const ReviewResponseElement: React.FC<ReviewResponseElementProps> = ({
  isCurrentReview,
  isConsolidation,
  shouldDim = false,
  shouldHideDecision = false,
  reviewResponse,
  children,
}) => {
  const backgroundClass = isCurrentReview ? 'changeable-background' : ''
  const dimClass = shouldDim ? 'dim' : ''

  const canReviewerEdit = (isCurrentReview && !!reviewResponse?.comment) as boolean

  return (
    <div className={`response-container ${backgroundClass} ${dimClass}`}>
      <div className="review-response-content ">
        {!shouldHideDecision && (
          <ElementDecisionLabel isConsolidation={isConsolidation} reviewResponse={reviewResponse} />
        )}
        {canReviewerEdit ? (
          <div className="comment-container">
            <Icon name="comment alternate outline" color="grey" />
            <p className="secondary">{reviewResponse.comment}</p>
          </div>
        ) : null}
      </div>

      <div className="action-container">{children}</div>
    </div>
  )
}

export default ReviewResponseElement
