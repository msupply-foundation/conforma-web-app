import { gql } from '@apollo/client'

export default gql`
  query getReview($reviewId: Int!) {
    review(id: $reviewId) {
      reviewer {
        id
        firstName
        lastName
      }
      reviewResponses {
        nodes {
          id
          comment
          reviewResponseDecision
          applicationResponse {
            id
          }
        }
      }
    }
  }
`
