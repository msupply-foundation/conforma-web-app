import {
  ReviewResponse,
  ReviewResponseDecision,
  ReviewResponseRecommendedApplicantVisibility,
  useUpdateReviewResponsesMutation,
} from '../generated/graphql'

const useUpdateReviewResponses = () => {
  const [updateReviewResponses] = useUpdateReviewResponsesMutation()

  const updateReviewResponse = async (reviewResponse: ReviewResponse) => {
    const reviewId = reviewResponse.review?.id
    if (!reviewId) return
    const reviewPatch = {
      reviewResponsesUsingId: {
        updateById: [
          {
            id: reviewResponse.id,
            patch: {
              comment: reviewResponse.comment,
              decision: reviewResponse.decision,
              recommendedApplicantVisibility: computeVisibility(reviewResponse),
            },
          },
        ],
      },
    }
    updateReviewResponses({ variables: { reviewId, reviewPatch } })
  }

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
    updateReviewResponses({ variables: { reviewId, reviewPatch } })
  }

  return { updateReviewResponse, updateMultipleReviewResponses }
}

// is_visible_to_applicant is set by an action on back, it uses
// recommended_application_visibility of the last level review to determine what
// will be visible to application in LOQ we can add a checkbox in decision modal
// to determine this (thus logic is placed here)
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
