import { gql } from '@apollo/client'

export default gql`
  query getReviewNew($reviewAssignmentId: Int!) {
    reviewAssignment(id: $reviewAssignmentId) {
      id
      application {
        id
        applicationResponses {
          nodes {
            ...Response
            reviewResponses {
              nodes {
                ...reviewResponseFragment
              }
            }
          }
        }
      }
      reviews {
        nodes {
          id
          reviewResponses(orderBy: TIME_CREATED_DESC) {
            nodes {
              ...reviewResponseFragment
            }
          }
        }
      }
    }
  }
`
