import { gql } from '@apollo/client'

export default gql`
  mutation reasignReviewAssignment(
    $unassignmentId: Int!
    # $unassignmentStatus: ReviewAssignmentStatus = AVAILABLE
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
      input: { id: $unassignmentId, patch: { status: AVAILABLE, isLocked: true } }
    ) {
      reviewAssignment {
        ...ReviewAssignment
      }
    }
  }
`
