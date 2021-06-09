import React, { useState } from 'react'
import { Icon } from 'semantic-ui-react'
import { SummaryViewWrapperProps } from '../../../formElementPlugins/types'
import { ApplicationResponse, ReviewResponse } from '../../../utils/generated/graphql'
import ApplicantResponseElement from './ApplicantResponseElement'
import ReviewResponseElement from './ReviewResponseElement'
import ReviewInlineInput from './ReviewInlineInput'
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
  const [isActiveEdit, setIsActiveEdit] = useState(false)
  const decisionExists = !!reviewResponse?.decision
  const triggerTitle = isNewApplicationResponse // can add check for isNewReviewResponseAlso
    ? strings.BUTTON_RE_REVIEW_RESPONSE
    : strings.BUTTON_REVIEW_RESPONSE

  const consolidationReviewResponse = previousReviewResponse?.reviewResponsesByReviewResponseLinkId
    .nodes[0] as ReviewResponse // There is only one reviewResponse associated per review cycle

  const getReviewDecisionOption = () => {
    if (!isActiveReviewResponse) return null
    if (isChangeRequest && !isNewReviewResponse)
      return (
        <ReviewElementTrigger
          title={strings.LABEL_RESPONSE_UPDATE}
          onClick={() => setIsActiveEdit(true)}
        />
      )
    return <UpdateIcon onClick={() => setIsActiveEdit(true)} />
  }

  return (
    <>
      {/* Application Response */}
      <ApplicantResponseElement
        applicationResponse={applicationResponse}
        summaryViewProps={summaryViewProps}
      >
        {isActiveReviewResponse && !decisionExists && (
          <ReviewElementTrigger
            title={triggerTitle}
            // onClick={showModal}
            onClick={() => setIsActiveEdit(true)}
          />
        )}
      </ApplicantResponseElement>
      {/* Inline Review area */}
      {isActiveEdit && (
        <ReviewInlineInput
          setIsActiveEdit={setIsActiveEdit}
          reviewResponse={reviewResponse as ReviewResponse}
          isConsolidation={false}
        />
      )}
      {/* Review Response */}
      {decisionExists && !isActiveEdit && (
        <>
          <ReviewResponseElement
            isCurrentReview={true}
            isConsolidation={false}
            reviewResponse={
              reviewResponse as ReviewResponse /* Casting to ReviewResponse since decision would exist if reviewResponse is defined */
            }
          >
            {getReviewDecisionOption()}
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
            />
          )}
        </>
      )}
    </>
  )
}

// TODO: Unify code with other ReviewElementTrigger
const ReviewElementTrigger: React.FC<{ title: string; onClick: () => void }> = ({
  title,
  onClick,
}) => (
  <p className="link-style clickable" onClick={onClick}>
    <strong>{title}</strong>
  </p>
)

export default ReviewApplicantResponse
