import { gql } from '@apollo/client'

export default gql`
  mutation updateReviewDecision($reviewDecisionId: Int!, $data: ReviewDecisionPatch!) {
    updateReviewDecision(input: { id: $reviewDecisionId, patch: $data }) {
      reviewDecision {
        id
        decision
        comment
      }
    }
  }
`
