import React from 'react'
import { SummaryViewWrapperProps } from '../../../formElementPlugins/types'
import { ApplicationResponse, ReviewResponse } from '../../../utils/generated/graphql'
import { AddIcon, UpdateIcon } from '../PageElements'
import ViewHistoryButton from '../ViewHistoryButton'
import ApplicantResponseElement from './ApplicantResponseElement'
import ReviewResponseElement from './ReviewResponseElement'

interface ApplicantElementWrapperProps {
  elementCode: string
  latestApplicationResponse: ApplicationResponse
  summaryViewProps: SummaryViewWrapperProps
  canApplicantAddNew: boolean
  canApplicantEdit: boolean
  enableViewHistory: boolean
  reviewResponse?: ReviewResponse
  updateMethod: () => void
  isChanged?: boolean
  isChangeRequest?: boolean
}

const ApplicantElementWrapper: React.FC<ApplicantElementWrapperProps> = ({
  elementCode,
  latestApplicationResponse,
  summaryViewProps,
  reviewResponse,
  canApplicantAddNew,
  canApplicantEdit,
  enableViewHistory,
  updateMethod,
  isChanged,
  isChangeRequest,
}) => {
  const canRenderReviewResponse = !!isChangeRequest && !!reviewResponse

  return (
    <>
      <ApplicantResponseElement
        key="application-response"
        applicationResponse={latestApplicationResponse}
        summaryViewProps={summaryViewProps}
        isResponseUpdated={!!isChangeRequest || !!isChanged}
      >
        {canApplicantAddNew ? (
          <AddIcon onClick={updateMethod} />
        ) : canApplicantEdit ? (
          <UpdateIcon onClick={updateMethod} />
        ) : null}
      </ApplicantResponseElement>
      {canRenderReviewResponse && (
        <ReviewResponseElement
          key="review-response"
          shouldDim={true}
          isCurrentReview={false}
          isDecisionVisible={false}
          isConsolidation={false}
          reviewResponse={reviewResponse as ReviewResponse}
        />
      )}
      {/* Show history - for previous Applicant responses */}
      {enableViewHistory && <ViewHistoryButton elementCode={elementCode} />}
    </>
  )
}

export default ApplicantElementWrapper
