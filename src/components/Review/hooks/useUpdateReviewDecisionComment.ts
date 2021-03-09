import { useUpdateReviewDecisionMutation } from '../../../utils/generated/graphql'

// below lines are used to get return type of the function that is returned by useUpdateReviewDecisionMutation
type UseUpdateReviewMutationReturnType = ReturnType<typeof useUpdateReviewDecisionMutation>
type promiseReturnType = ReturnType<UseUpdateReviewMutationReturnType[0]>

// hook used to update review decision comment, as per type definition below (returns promise that resolve with mutation result data)
type UseSubmitReview = (reviewDecisionId: number) => (comment: string) => promiseReturnType

const useUpdateReviewDecisionComment: UseSubmitReview = (reviewDecisionId) => {
  const [updateReviewDecision] = useUpdateReviewDecisionMutation()

  return async (comment: string) =>
    updateReviewDecision({ variables: { reviewDecisionId, data: { comment } } })
}

export default useUpdateReviewDecisionComment
