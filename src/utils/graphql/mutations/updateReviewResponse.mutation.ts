import { gql } from '@apollo/client'

export default gql`
  mutation updateReviewResponse($id: Int!, $decision: ReviewResponseDecision, $comment: String) {
    updateReviewResponse(
      input: { id: $id, patch: { reviewResponseDecision: $decision, comment: $comment } }
    ) {
      clientMutationId
    }
  }
`
