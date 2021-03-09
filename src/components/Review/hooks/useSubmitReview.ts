import {
  Decision,
  ReviewPatch,
  useUpdateReviewMutation,
  ReviewResponseStatus,
  Trigger,
} from '../../../utils/generated/graphql'
import { FullStructure } from '../../../utils/types'

// below lines are used to get return type of the function that is returned by useUpdateReviewMutation
type UseUpdateReviewMutationReturnType = ReturnType<typeof useUpdateReviewMutation>
type promiseReturnType = ReturnType<UseUpdateReviewMutationReturnType[0]>
// hook used to submit review, , as per type definition below (returns promise that resolve with mutation result data)
type UseSubmitReview = (
  reviewId: number
) => (structure: FullStructure, decision: Decision) => promiseReturnType

type ConstructReviewPatch = (structure: FullStructure, decision: Decision) => ReviewPatch

const useSubmitReview: UseSubmitReview = (reviewId) => {
  const [updateReview] = useUpdateReviewMutation()

  const constructReviewPatch: ConstructReviewPatch = (structure, decision) => {
    const reviewResponses = Object.values(structure?.elementsById || []).filter(
      (element) => element.thisReviewLatestResponse
    )

    const reviewResponsesPatch = reviewResponses.map(({ thisReviewLatestResponse }) => ({
      patch: {
        decision: thisReviewLatestResponse?.decision,
        comment: thisReviewLatestResponse?.comment,
        status: ReviewResponseStatus.Submitted,
      },
      id: Number(thisReviewLatestResponse?.id),
    }))

    const reviewDecision = structure.thisReview?.reviewDecision

    const reviewDecisionPatch = {
      id: Number(reviewDecision?.id),
      patch: {
        comment: reviewDecision?.comment || undefined,
        decision: decision,
      },
    }

    return {
      trigger: Trigger.OnReviewSubmit,
      reviewResponsesUsingId: {
        updateById: reviewResponsesPatch,
      },
      reviewDecisionsUsingId: {
        updateById: [reviewDecisionPatch],
      },
    }
  }

  const submitReview = async (structure: FullStructure, decision: Decision) =>
    updateReview({
      variables: {
        reviewId: reviewId,
        reviewPatch: constructReviewPatch(structure, decision),
      },
    })

  return submitReview
}

export default useSubmitReview
