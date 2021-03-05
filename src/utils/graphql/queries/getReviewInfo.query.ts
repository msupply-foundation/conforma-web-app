import { gql } from '@apollo/client'

export default gql`
  query getReviewInfo($reviewerId: Int!, $applicationId: Int) {
    reviewAssignments(condition: { reviewerId: $reviewerId, applicationId: $applicationId }) {
      nodes {
        id
        timeCreated
        reviewer {
          id
          username
          firstName
          lastName
        }
        reviews {
          nodes {
            id
            status
            timeCreated
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
