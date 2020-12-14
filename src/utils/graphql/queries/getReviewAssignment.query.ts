import { gql } from '@apollo/client'

export default gql`
  query getReviewAssignment($reviewerId: Int!, $applicationId: Int, $stageId: Int) {
    reviewAssignments(
      condition: { reviewerId: $reviewerId, applicationId: $applicationId, stageId: $stageId }
    ) {
      nodes {
        id
        reviews {
          nodes {
            id
            status
            trigger
          }
        }
        reviewQuestionAssignments {
          nodes {
            templateElement {
              id
              code
              section {
                id
                index
              }
              applicationResponses {
                nodes {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`
