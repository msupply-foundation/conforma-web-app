import { gql } from '@apollo/client'

export default gql`
  mutation reassignReviewAssignment(
    $unassignmentId: Int!
    $reassignmentId: Int!
    $reassignmentPatch: ReviewAssignmentPatch!
    $unassignmentPatch: ReviewAssignmentPatch!
  ) {
    reassignmentUpdate: updateReviewAssignment(
      input: { id: $reassignmentId, patch: $reassignmentPatch }
    ) {
      reviewAssignment {
        ...ReviewAssignment
      }
    }
    unassignmentUpdate: updateReviewAssignment(
      input: { id: $unassignmentId, patch: $unassignmentPatch }
    ) {
      reviewAssignment {
        ...ReviewAssignment
      }
    }
  }
`
