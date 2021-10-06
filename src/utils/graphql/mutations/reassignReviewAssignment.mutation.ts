import { gql } from '@apollo/client'

export default gql`
  mutation reassignReviewAssignment(
    $unassignmentId: Int!
    $reassignmentId: Int!
    $reassignmentPatch: ReviewAssignmentPatch!
  ) {
    reassignmentUpdate: updateReviewAssignment(
      input: { id: $reassignmentId, patch: $reassignmentPatch }
    ) {
      reviewAssignment {
        ...ReviewAssignment
      }
    }
    unassignmentUpdate: updateReviewAssignment(
      input: {
        id: $unassignmentId
        patch: { status: AVAILABLE, isLocked: true, trigger: ON_REVIEW_UNASSIGN }
      }
    ) {
      reviewAssignment {
        ...ReviewAssignment
      }
    }
  }
`
