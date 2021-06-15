import React, { useState } from 'react'
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
  isChangeRequest: boolean
  isChanged: boolean
  showModal: () => void
}

const ReviewApplicantResponse: React.FC<ReviewApplicantResponseProps> = ({
  applicationResponse,
  summaryViewProps,
  reviewResponse,
  previousReviewResponse,
  isNewApplicationResponse,
  isActiveReviewResponse,
  isChangeRequest,
  isChanged,
  showModal,
}) => {
  const [isActiveEdit, setIsActiveEdit] = useState(false)
  const decisionExists = !!reviewResponse?.decision
  const triggerTitle = isNewApplicationResponse
    ? strings.BUTTON_RE_REVIEW_RESPONSE
    : strings.BUTTON_REVIEW_RESPONSE

  const consolidationReviewResponse = previousReviewResponse?.reviewResponsesByReviewResponseLinkId
    .nodes[0] as ReviewResponse // There is only one reviewResponse associated per review cycle

  const getConsolidationAndReview = () => (
    <>
      {isChangeRequest && isChanged && (
        <ReviewResponseElement
          isCurrentReview={true}
          isConsolidation={false}
          reviewResponse={reviewResponse as ReviewResponse}
        >
          {getReviewDecisionOption()}
        </ReviewResponseElement>
      )}
      {consolidationReviewResponse && (
        <ReviewResponseElement
          isCurrentReview={false}
          isConsolidation={true}
          reviewResponse={consolidationReviewResponse}
          shouldDim={isChangeRequest && isChanged}
        />
      )}
      {previousReviewResponse && !isChanged && (
        <ReviewResponseElement
          isCurrentReview={true}
          isConsolidation={false}
          reviewResponse={previousReviewResponse as ReviewResponse}
        >
          {getReviewDecisionOption()}
        </ReviewResponseElement>
      )}
    </>
  )

  const getReviewDecisionOption = () => {
    if (!isActiveReviewResponse) return null
    if (isChangeRequest && !isChanged)
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
      {isActiveEdit && !consolidationReviewResponse ? (
        /* Inline Review area + Applicant response in context*/
        <div className="blue-border">
          <ApplicantResponseElement
            applicationResponse={applicationResponse}
            summaryViewProps={summaryViewProps}
          />
          <ReviewInlineInput
            setIsActiveEdit={setIsActiveEdit}
            reviewResponse={reviewResponse as ReviewResponse}
            isConsolidation={false}
          />
        </div>
      ) : (
        /* Application Response */
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
      )}
      {decisionExists &&
        (isActiveEdit && consolidationReviewResponse ? (
          /* Inline Review area + Previous review and consolidation in context*/
          <div className="blue-border">
            <ReviewResponseElement
              isCurrentReview={false}
              isConsolidation={true}
              reviewResponse={consolidationReviewResponse}
              shouldDim={isChangeRequest && isChanged}
            />
            <ReviewInlineInput
              setIsActiveEdit={setIsActiveEdit}
              reviewResponse={reviewResponse as ReviewResponse}
              isConsolidation={false}
            />
          </div>
        ) : (
          /* Consolidation Response + current or previous review (in cronological order) */
          getConsolidationAndReview()
        ))}
      {/* div below forced border on review response to be square */}
      <div />
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
