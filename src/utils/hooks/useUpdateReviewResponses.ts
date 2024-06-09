import {
  ReviewResponse,
  ReviewResponseDecision,
  ReviewResponseRecommendedApplicantVisibility,
  useUpdateReviewMutation,
  useUpdateReviewResponseMutation,
} from '../generated/graphql'

// below lines are used to get return type of the function that is returned by useUpdateReviewResponseMutation
type UseUpdateReviewMutationReturnType = ReturnType<typeof useUpdateReviewResponseMutation>
type PromiseReturnType = ReturnType<UseUpdateReviewMutationReturnType[0]>

// Hook to update review responses. Either updates individual response or a
// batch via updating review object.
// Also computes recommendedApplicantVisibility
type UseUpdateReviewResponse = () => {
  updateReviewResponse: (reviewResponse: ReviewResponse) => PromiseReturnType
  updateMultipleReviewResponses: any
}

const useUpdateReviewResponses: UseUpdateReviewResponse = () => {
  const [updateReviewResponseMutation] = useUpdateReviewResponseMutation()
  const [updateMultipleResponsesMutation] = useUpdateReviewMutation()

  const updateReviewResponse = async (reviewResponse: ReviewResponse) =>
    updateReviewResponseMutation({
      variables: {
        id: reviewResponse.id,
        comment: reviewResponse.comment,
        decision: reviewResponse.decision,
        recommendedApplicantVisibility: computeVisibility(reviewResponse),
      },
    })

  const updateMultipleReviewResponses = async (responses: ReviewResponse[]) => {
    const reviewId = responses[0].review?.id
    if (!reviewId) return
    const reviewPatch = {
      reviewResponsesUsingId: {
        updateById: responses.map((response) => ({
          id: response.id,
          patch: {
            comment: response.comment,
            decision: response.decision,
            recommendedApplicantVisibility: computeVisibility(response),
          },
        })),
      },
    }
    updateMultipleResponsesMutation({ variables: { reviewId, reviewPatch } })
  }

  return { updateReviewResponse, updateMultipleReviewResponses }
}

// is_visible_to_applicant is set by an action on back, it uses recomended_application_visibility of the
// last level review to determine what will be visible to application in LOQ
// we can add a checkbox in decision modal to determine this (thus logic is placed here)
const computeVisibility = (reviewResponse: ReviewResponse | undefined) => {
  // would rather computer this from actual review level, but dont' want to pass too far as props or rely on context
  if (!reviewResponse)
    return ReviewResponseRecommendedApplicantVisibility.OriginalResponseNotVisibleToApplicant

  const isLevelOne = reviewResponse.originalReviewResponseId === reviewResponse.id

  if (isLevelOne) {
    if (reviewResponse.decision === ReviewResponseDecision.Decline)
      return ReviewResponseRecommendedApplicantVisibility.OriginalResponseVisibleToApplicant

    return ReviewResponseRecommendedApplicantVisibility.OriginalResponseNotVisibleToApplicant
  }
  // consolidator
  if (
    reviewResponse.decision === ReviewResponseDecision.Agree &&
    reviewResponse.reviewResponseLink?.decision === ReviewResponseDecision.Decline
  )
    return ReviewResponseRecommendedApplicantVisibility.OriginalResponseVisibleToApplicant
  return ReviewResponseRecommendedApplicantVisibility.OriginalResponseNotVisibleToApplicant
}

export default useUpdateReviewResponses
