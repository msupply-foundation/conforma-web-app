import { gql } from '@apollo/client'

export default gql`
  query getReview($reviewId: Int!) {
    review(id: $reviewId) {
      reviewer {
        id
        username
        firstName
        lastName
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
