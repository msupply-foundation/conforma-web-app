import { gql } from '@apollo/client'

// TODO: Remove this

export default gql`
  query getReviewStatus($reviewId: Int!) {
    reviewStatusHistories(condition: { isCurrent: true, reviewId: $reviewId }) {
      nodes {
        status
      }
    }
  }
`
