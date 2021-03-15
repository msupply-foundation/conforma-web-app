import { gql } from '@apollo/client'

export default gql`
  mutation updateReview($reviewId: Int!, $reviewPatch: ReviewPatch!) {
    updateReview(input: { id: $reviewId, patch: $reviewPatch }) {
      review {
        id
        trigger
        reviewDecisions {
          nodes {
            id
            decision
            timeUpdated
          }
        }
      }
    }
  }
`
