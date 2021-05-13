import React from 'react'
import { SummaryViewWrapperProps } from '../../../formElementPlugins/types'
import { ApplicationResponse, ReviewResponse } from '../../../utils/generated/graphql'
import ApplicantResponseElement from './ApplicantResponseElement'
import ReviewResponseElement from './ReviewResponseElement'
import strings from '../../../utils/constants'
import { Icon } from 'semantic-ui-react'

interface ConsolidateReviewDecisionProps {
  applicationResponse: ApplicationResponse
  summaryViewProps: SummaryViewWrapperProps
  reviewResponse: ReviewResponse
  isNewApplicationResponse: boolean
  /* can add check for isNewReviewResponse */
  originalReviewResponse?: ReviewResponse
  showModal: () => void
}
const ConsolidateReviewDecision: React.FC<ConsolidateReviewDecisionProps> = ({
  applicationResponse,
  summaryViewProps,
  reviewResponse,
  isNewApplicationResponse,
  originalReviewResponse,
  showModal,
}) => {
  const isConsolidation = true
  const decisionExists = !!reviewResponse?.decision

  return (
    <div>
      {/* Application Response */}
      <ApplicantResponseElement
        applicationResponse={applicationResponse}
        summaryViewProps={summaryViewProps}
      />
      {/* Consolidation Response */}
      <ReviewResponseElement
        isCurrentReview={true}
        isConsolidation={isConsolidation}
        isNewApplicationResponse={isNewApplicationResponse}
        applicationResponse={applicationResponse}
        reviewResponse={reviewResponse}
        originalReviewResponse={originalReviewResponse}
      >
        {decisionExists && <UpdateIcon onClick={showModal} />}
      </ReviewResponseElement>
      {/* Review Response */}
      {originalReviewResponse && (
        <ReviewResponseElement
          isCurrentReview={false}
          isConsolidation={isConsolidation}
          isNewApplicationResponse={isNewApplicationResponse}
          applicationResponse={applicationResponse}
          reviewResponse={originalReviewResponse as ReviewResponse}
        >
          {!decisionExists && (
            <ReviewElementTrigger title={strings.BUTTON_REVIEW_RESPONSE} onClick={showModal} />
          )}
        </ReviewResponseElement>
      )}
    </div>
  )
}

const ReviewElementTrigger: React.FC<{ title: string; onClick: () => void }> = ({
  title,
  onClick,
}) => (
  <p className="link-style clickable" onClick={onClick}>
    <strong>{title}</strong>
  </p>
)

const UpdateIcon: React.FC<{ onClick: Function }> = ({ onClick }) => (
  <Icon className="clickable" name="pencil" size="large" color="blue" onClick={onClick} />
)

export default ConsolidateReviewDecision
