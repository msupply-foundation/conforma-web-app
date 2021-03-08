import { FetchResult } from '@apollo/client'
import {
  UpdateReviewDecisionMutation,
  useUpdateReviewDecisionMutation,
} from '../../../utils/generated/graphql'

// below type is constructred by using suggestion
type promiseReturnType = Promise<
  FetchResult<UpdateReviewDecisionMutation, Record<string, any>, Record<string, any>>
>
// hook used to update review decision comment, as per type definition below (returns promise that resolve with mutation result data)
type UseSubmitReview = (reviewDecisionId: number) => (comment: string) => promiseReturnType

const useUpdateReviewDecisionComment: UseSubmitReview = (reviewDecisionId) => {
  const [updateReviewDecision] = useUpdateReviewDecisionMutation()

  return async (comment: string) =>
    updateReviewDecision({ variables: { reviewDecisionId, data: { comment } } })
}

export default useUpdateReviewDecisionComment
