import React, { useState } from 'react'
import { SummaryViewWrapperProps } from '../../../formElementPlugins/types'
import { ApplicationResponse, ReviewResponse } from '../../../utils/generated/graphql'
import ApplicantResponseElement from './ApplicantResponseElement'
import ReviewResponseElement from './ReviewResponseElement'
import ReviewInlineInput from './ReviewInlineInput'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { AddIcon, UpdateIcon } from '../PageElements'
import ViewHistoryButton from '../ViewHistoryButton'
import ReviewInlineNewResponse from './ReviewInlineNewResponse'
import { ReviewDetails } from '../../../utils/types'

type ReviewType =
  | 'NotReviewable'
  | 'FirstReviewApplication'
  | 'UpdateChangesRequested'
  | 'ReReviewApplication' // 'Consolidation' is done in separated component
  | 'OptionallyReviewable'

interface ReviewApplicantResponseProps {
  elementCode: string
  canEdit: boolean
  applicationResponse: ApplicationResponse
  summaryViewProps: SummaryViewWrapperProps
  stageNumber: number
  reviewResponse?: ReviewResponse
  previousReviewResponse?: ReviewResponse
  isActiveReviewResponse: boolean
  isNewApplicationResponse: boolean
  enableViewHistory: boolean
  isChangeRequest: boolean
  isChanged: boolean
  reviewInfo: ReviewDetails
}

const ReviewApplicantResponse: React.FC<ReviewApplicantResponseProps> = ({
  elementCode,
  canEdit,
  applicationResponse,
  summaryViewProps,
  stageNumber,
  reviewResponse,
  previousReviewResponse,
  isNewApplicationResponse,
  isActiveReviewResponse,
  enableViewHistory,
  isChangeRequest,
  isChanged,
  reviewInfo,
}) => {
  const { t } = useLanguageProvider()
  const [isActiveEdit, setIsActiveEdit] = useState(false)
  const decisionExists = !!reviewResponse?.decision
  const triggerTitle = isNewApplicationResponse
    ? t('BUTTON_RE_REVIEW_RESPONSE')
    : t('BUTTON_REVIEW_RESPONSE')

  const consolidationReviewResponse = previousReviewResponse?.reviewResponsesByReviewResponseLinkId
    .nodes[0] as ReviewResponse // There is only one reviewResponse associated per review cycle

  const reviewType: ReviewType = isNewApplicationResponse
    ? 'ReReviewApplication'
    : isChangeRequest
    ? 'UpdateChangesRequested'
    : reviewResponse
    ? 'FirstReviewApplication'
    : applicationResponse === undefined
    ? 'OptionallyReviewable'
    : 'NotReviewable'

  const getReviewDecisionOption = () => {
    if (canEdit && isActiveReviewResponse && isChangeRequest && !isChanged)
      return (
        <ReviewElementTrigger
          title={t('LABEL_RESPONSE_UPDATE')}
          onClick={() => setIsActiveEdit(true)}
        />
      )
    return null
  }

  switch (reviewType) {
    case 'UpdateChangesRequested':
      return (
        <>
          {/* Applicant Response */}
          <ApplicantResponseElement
            applicationResponse={applicationResponse}
            summaryViewProps={summaryViewProps}
          />
          {isActiveEdit ? (
            /* Inline Review area + Consolidation in context*/
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
            <>
              {/* Consolidation Response (in chronological order) */}
              {isChangeRequest && isChanged && (
                <ReviewResponseElement
                  isCurrentReview={true}
                  isConsolidation={false}
                  reviewResponse={reviewResponse}
                >
                  {canEdit && isActiveReviewResponse && (
                    <UpdateIcon onClick={() => setIsActiveEdit(true)} />
                  )}
                </ReviewResponseElement>
              )}
              {consolidationReviewResponse && (
                <ReviewResponseElement
                  isCurrentReview={false}
                  isConsolidation={true}
                  reviewResponse={consolidationReviewResponse}
                  shouldDim={isChanged}
                />
              )}
              {!isChanged && (
                <ReviewResponseElement
                  isCurrentReview={true}
                  isConsolidation={false}
                  reviewResponse={previousReviewResponse}
                >
                  {getReviewDecisionOption()}
                </ReviewResponseElement>
              )}
            </>
          )}
          {/* Show history - for previous reviews done */}
          {enableViewHistory && <ViewHistoryButton elementCode={elementCode} />}
        </>
      )

    case 'ReReviewApplication':
    case 'FirstReviewApplication':
    case 'OptionallyReviewable':
      return (
        <>
          {isActiveEdit ? (
            /* Inline Review area + Applicant response in context*/
            <div className="blue-border">
              <ApplicantResponseElement
                applicationResponse={applicationResponse}
                summaryViewProps={summaryViewProps}
              />
              {reviewType === 'OptionallyReviewable' ? (
                <ReviewInlineNewResponse
                  setIsActiveEdit={setIsActiveEdit}
                  stageNumber={stageNumber}
                  summaryViewProps={summaryViewProps}
                  reviewInfo={reviewInfo}
                />
              ) : (
                <ReviewInlineInput
                  setIsActiveEdit={setIsActiveEdit}
                  reviewResponse={reviewResponse as ReviewResponse}
                  isConsolidation={false}
                />
              )}
            </div>
          ) : (
            <>
              {/* Application Response */}
              <ApplicantResponseElement
                applicationResponse={applicationResponse}
                summaryViewProps={summaryViewProps}
              >
                {canEdit &&
                  !decisionExists &&
                  (reviewType === 'OptionallyReviewable' ? (
                    // New review for empty application response
                    <AddIcon onClick={() => setIsActiveEdit(true)} />
                  ) : (
                    <ReviewElementTrigger
                      title={triggerTitle} // Review or Re-review
                      onClick={() => setIsActiveEdit(true)}
                    />
                  ))}
              </ApplicantResponseElement>
              {/* Current review response */}
              {isActiveReviewResponse
                ? canEdit &&
                  decisionExists && (
                    <ReviewResponseElement
                      isCurrentReview={true}
                      isConsolidation={false}
                      reviewResponse={reviewResponse}
                    >
                      {canEdit && <UpdateIcon onClick={() => setIsActiveEdit(true)} />}
                    </ReviewResponseElement>
                  )
                : decisionExists && (
                    <ReviewResponseElement
                      isCurrentReview={true}
                      isConsolidation={false}
                      reviewResponse={reviewResponse}
                    />
                  )}
              {/* Previous review response */}
              {isNewApplicationResponse && !decisionExists && (
                <ReviewResponseElement
                  isCurrentReview={false}
                  isConsolidation={false}
                  reviewResponse={previousReviewResponse}
                />
              )}
            </>
          )}
          {/* Show history - for previous reviews done */}
          {enableViewHistory && <ViewHistoryButton elementCode={elementCode} />}
        </>
      )
    default:
      // 'NotReviewable'
      return (
        <ApplicantResponseElement
          applicationResponse={applicationResponse}
          summaryViewProps={summaryViewProps}
        />
      )
  }
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
