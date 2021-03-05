import { gql } from '@apollo/client'

export default gql`
  query getReviewInfo($reviewerId: Int!, $applicationId: Int) {
    reviewAssignments(
      condition: { reviewerId: $reviewerId, applicationId: $applicationId }
      orderBy: TIME_CREATED_DESC
    ) {
      nodes {
        id
        status
        timeCreated
        reviews {
          nodes {
            id
            level
            status
            timeCreated
            trigger
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
