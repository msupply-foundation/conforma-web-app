import { gql } from '@apollo/client'

export default gql`
  mutation unassignReviewAssignment($unassignmentId: Int!) {
    updateReviewAssignment(
      input: {
        id: $unassignmentId
        patch: {
          status: AVAILABLE
          trigger: ON_REVIEW_UNASSIGN
          reviewQuestionAssignmentsUsingId: { deleteOthers: true }
        }
      }
    ) {
      reviewAssignment {
        ...ReviewAssignment
      }
    }
  }
`
