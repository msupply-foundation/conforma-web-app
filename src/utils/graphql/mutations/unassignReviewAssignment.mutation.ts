import { gql } from '@apollo/client'

export default gql`
  mutation unassignReviewAssignment($unassignmentId: Int!) {
    updateReviewAssignment(
      input: {
        id: $unassignmentId
        patch: { status: AVAILABLE, isLocked: false, trigger: ON_REVIEW_UNASSIGN }
      }
    ) {
      reviewAssignment {
        ...ReviewAssignment
      }
    }
  }
`
