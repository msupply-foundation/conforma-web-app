import React from 'react'
import { SummaryViewWrapperProps } from '../../../formElementPlugins/types'
import { ApplicationResponse, ReviewResponse } from '../../../utils/generated/graphql'
import ApplicantResponseElement from './ApplicantResponseElement'
import ReviewResponseElement from './ReviewResponseElement'
import strings from '../../../utils/constants'
import { UpdateIcon } from '../PageElements'

interface ReviewApplicantResponseProps {
  applicationResponse: ApplicationResponse
  summaryViewProps: SummaryViewWrapperProps
  reviewResponse?: ReviewResponse
  previousReviewResponse?: ReviewResponse
  isActiveReviewResponse: boolean
  isNewApplicationResponse: boolean
  isNewReviewResponse?: boolean
  isChangeRequest?: boolean
  showModal: () => void
}

const ReviewApplicantResponse: React.FC<ReviewApplicantResponseProps> = ({
  applicationResponse,
  summaryViewProps,
  reviewResponse,
  previousReviewResponse,
  isNewApplicationResponse,
  isActiveReviewResponse,
  isNewReviewResponse = false,
  isChangeRequest = false,
  showModal,
}) => {
  const decisionExists = !!reviewResponse?.decision
  const triggerTitle = isNewApplicationResponse // can add check for isNewReviewResponseAlso
    ? strings.BUTTON_RE_REVIEW_RESPONSE
    : strings.BUTTON_REVIEW_RESPONSE

  const consolidationReviewResponse = previousReviewResponse?.reviewResponsesByReviewResponseLinkId
    .nodes[0] as ReviewResponse // There is only one reviewResponse associated per review cycle

  return (
    <>
      {/* Application Response */}
      <ApplicantResponseElement
        applicationResponse={applicationResponse}
        summaryViewProps={summaryViewProps}
      >
        {isActiveReviewResponse && !decisionExists && (
          <ReviewElementTrigger title={triggerTitle} onClick={showModal} />
        )}
      </ApplicantResponseElement>
      {/* Review Response */}
      {decisionExists && (
        <>
          <ReviewResponseElement
            isCurrentReview={true}
            isConsolidation={false}
            reviewResponse={
              reviewResponse as ReviewResponse /* Casting to ReviewResponse since decision would exist if reviewResponse is defined */
            }
          >
            {isActiveReviewResponse &&
              (isChangeRequest && !isNewApplicationResponse ? (
                <ReviewElementTrigger title={strings.LABEL_RESPONSE_UPDATE} onClick={showModal} />
              ) : (
                <UpdateIcon onClick={showModal} />
              ))}
          </ReviewResponseElement>
          {/* div below forced border on review response to be square */}
          <div />
          {/* Consolidation Response */}
          {consolidationReviewResponse && (
            <ReviewResponseElement
              isCurrentReview={false}
              isConsolidation={true}
              reviewResponse={consolidationReviewResponse}
              shouldDim={isNewReviewResponse}
            ></ReviewResponseElement>
          )}
        </>
      )}
    </>
  )
}

// TODO: Unify code with ReviewElementTrigger
const ReviewElementTrigger: React.FC<{ title: string; onClick: () => void }> = ({
  title,
  onClick,
}) => (
  <p className="link-style clickable" onClick={onClick}>
    <strong>{title}</strong>
  </p>
)

export default ReviewApplicantResponse
