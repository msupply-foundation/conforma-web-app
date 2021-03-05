import { gql } from '@apollo/client'

export default gql`
  query getReviewInfo($reviewerId: Int!, $applicationId: Int) {
    reviewAssignments(condition: { reviewerId: $reviewerId, applicationId: $applicationId }) {
      nodes {
        id
        timeCreated
        reviews {
          nodes {
            id
            status
            timeCreated
            level
          }
        }
        stage {
          title
          id
        }
        reviewQuestionAssignments {
          totalCount
        }
      }
    }
  }
`
