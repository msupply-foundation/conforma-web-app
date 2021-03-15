import { gql } from '@apollo/client'

export default gql`
  query getReviewDecisionComment($reviewDecisionId: Int!) {
    reviewDecision(id: $reviewDecisionId) {
      id
      comment
    }
  }
`
