import { useUpdateReviewDecisionMutation } from '../../../utils/generated/graphql'

// hook used to update review decision comment, as per type definition below (returns promise that resolve with mutation result data)
type UseSubmitReview = (reviewDecisionId: number) => (comment: string) => Promise<void>

const useUpdateReviewDecisionComment: UseSubmitReview = (reviewDecisionId) => {
  const [updateReviewDecision] = useUpdateReviewDecisionMutation()

  return async (comment: string) => {
    updateReviewDecision({ variables: { reviewDecisionId, data: { comment } } })
  }
}

export default useUpdateReviewDecisionComment
