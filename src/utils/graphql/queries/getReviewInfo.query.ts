import { gql } from '@apollo/client'

export default gql`
  query getReviewInfo($applicationId: Int, $assignerId: Int!) {
    reviewAssignments(condition: { applicationId: $applicationId }, orderBy: TIME_UPDATED_DESC) {
      nodes {
        ...ReviewAssignment
        stage {
          id
          number
          title
          colour
        }
        timeStageCreated
        trigger
        level {
          singleReviewerAllSections
        }
        reviewer {
          id
          firstName
          lastName
        }
        reviews {
          nodes {
            id
            status
            timeStatusCreated
            trigger
            isLocked
            reviewDecisions(orderBy: TIME_UPDATED_DESC) {
              nodes {
                id
                # don't want to get comment here (it is queried and set independently, to re-fireing of useGetReviewInfo when comment changed)
                decision
              }
            }
          }
        }
        reviewAssignmentAssignerJoins(filter: { assignerId: { equalTo: $assignerId } }) {
          nodes {
            assigner {
              firstName
              lastName
              id
            }
          }
        }
      }
    }
  }
`
