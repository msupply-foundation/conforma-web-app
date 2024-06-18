import { gql } from '@apollo/client'

export default gql`
  mutation updateReviewResponses($reviewId: Int!, $reviewPatch: ReviewPatch!) {
    updateReview(input: { id: $reviewId, patch: $reviewPatch }) {
      review {
        reviewResponses {
          nodes {
            id
            decision
            comment
          }
        }
      }
    }
  }
`
