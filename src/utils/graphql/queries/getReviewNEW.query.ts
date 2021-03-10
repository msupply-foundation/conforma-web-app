import { gql } from '@apollo/client'

// For review responses linked to applicationResponses, we want to get either submitted responses
// Or draft response that belong to current user
export default gql`
  query getReviewNew($reviewAssignmentId: Int!, $userId: Int!, $sectionIds: [Int!]) {
    reviewAssignment(id: $reviewAssignmentId) {
      id
      reviewQuestionAssignments {
        nodes {
          id
          templateElementId
        }
      }
      reviews(
        filter: {
          or: [
            { status: { equalTo: SUBMITTED } }
            { and: [{ status: { equalTo: DRAFT } }, { reviewer: { id: { equalTo: $userId } } }] }
          ]
        }
      ) {
        nodes {
          id
          status
          reviewResponses(
            orderBy: TIME_UPDATED_DESC
            filter: { templateElement: { section: { id: { in: $sectionIds } } } }
          ) {
            nodes {
              ...reviewResponseFragment
              applicationResponse {
                templateElementId
              }
            }
          }
        }
      }
    }
  }
`
