import { gql } from '@apollo/client'

export default gql`
  query getReview($reviewId: Int!) {
    review(id: $reviewId) {
      reviewer {
        id
        username
      }
      reviewResponses {
        nodes {
          id
          comment
          decision
          applicationResponse {
            id
          }
        }
      }
    }
  }
`
