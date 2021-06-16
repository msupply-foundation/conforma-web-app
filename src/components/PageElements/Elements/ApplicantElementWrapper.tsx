import React from 'react'
import { SummaryViewWrapperProps } from '../../../formElementPlugins/types'
import { ApplicationResponse, ReviewResponse } from '../../../utils/generated/graphql'
import { useRouter } from '../../../utils/hooks/useRouter'
import { UpdateIcon } from '../PageElements'
import ViewHistoryButton from '../ViewHistoryButton'
import ApplicantResponseElement from './ApplicantResponseElement'
import ReviewResponseElement from './ReviewResponseElement'

interface ApplicantElementWrapperProps {
  latestApplicationResponse: ApplicationResponse
  previousApplicationResponse?: ApplicationResponse
  summaryViewProps: SummaryViewWrapperProps
  canApplicantEdit: boolean
  reviewResponse?: ReviewResponse
  updateMethod: () => void
  isChanged?: boolean
  isChangeRequest?: boolean
}

const ApplicantElementWrapper: React.FC<ApplicantElementWrapperProps> = ({
  latestApplicationResponse,
  previousApplicationResponse,
  summaryViewProps,
  reviewResponse,
  canApplicantEdit,
  updateMethod,
  isChanged,
  isChangeRequest,
}) => {
  const { push } = useRouter()
  const canRenderReviewResponse = !!isChangeRequest && !!reviewResponse
  return (
    <>
      <ApplicantResponseElement
        key="application-response"
        applicationResponse={latestApplicationResponse}
        summaryViewProps={summaryViewProps}
        isResponseUpdated={!!isChangeRequest || !!isChanged}
      >
        {canApplicantEdit && <UpdateIcon onClick={updateMethod} />}
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
      {!!previousApplicationResponse && <ViewHistoryButton />}
    </>
  )
}

export default ApplicantElementWrapper
