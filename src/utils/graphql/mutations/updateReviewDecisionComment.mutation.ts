import { gql } from '@apollo/client'

export default gql`
  mutation updateReviewDecisionComment($reviewDecisionId: Int!, $comment: String!) {
    updateReviewDecision(input: { id: $reviewDecisionId, patch: { comment: $comment } }) {
      reviewDecision {
        id
        decision
        comment
      }
    }
  }
`
