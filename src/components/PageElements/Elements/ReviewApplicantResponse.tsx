import React from 'react'
import { Icon } from 'semantic-ui-react'
import { SummaryViewWrapperProps } from '../../../formElementPlugins/types'
import { ApplicationResponse, ReviewResponse } from '../../../utils/generated/graphql'
import ApplicantResponseElement from './ApplicantResponseElement'
import ReviewResponseElement from './ReviewResponseElement'
import strings from '../../../utils/constants'
interface ReviewApplicantResponseProps {
  applicationResponse: ApplicationResponse
  summaryViewProps: SummaryViewWrapperProps
  reviewResponse?: ReviewResponse
  isActiveReviewResponse: boolean
  isNewApplicationResponse: boolean
  showModal: () => void
}

const ReviewApplicantResponse: React.FC<ReviewApplicantResponseProps> = ({
  applicationResponse,
  summaryViewProps,
  reviewResponse,
  isNewApplicationResponse,
  isActiveReviewResponse,
  showModal,
}) => {
  const decisionExists = !!reviewResponse?.decision
  // After review is submitted, reviewResponses are trimmed if they are not changed duplicates
  // or if they are null, we only want to show reviewResponses that are linked to latestApplicationResponse
  const isNewReview = applicationResponse.id !== reviewResponse?.applicationResponse?.id

  return (
    <div>
      {/* Application Response */}
      <ApplicantResponseElement
        applicationResponse={applicationResponse}
        summaryViewProps={summaryViewProps}
      >
        {isActiveReviewResponse && !decisionExists && (
          <ReviewElementTrigger
            title={
              isNewApplicationResponse /* can add check for isNewReviewResponseAlso */
                ? strings.BUTTON_RE_REVIEW_RESPONSE
                : strings.BUTTON_REVIEW_RESPONSE
            }
            onClick={showModal}
          />
        )}
      </ApplicantResponseElement>
      {/* Review Response */}
      {!isNewReview && reviewResponse && (
        <ReviewResponseElement
          isCurrentReview={true}
          isConsolidation={false}
          applicationResponse={applicationResponse}
          reviewResponse={reviewResponse}
        >
          {isActiveReviewResponse && decisionExists && <UpdateIcon onClick={showModal} />}
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

export default ReviewApplicantResponse
