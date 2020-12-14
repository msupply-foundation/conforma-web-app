import { gql } from '@apollo/client'

export default gql`
  query getTriggers(
    $serial: String
    $reviewAssignmentId: Int
    $reviewId: Int
    $getApplicationTriggers: Boolean!
    $getReviewTriggers: Boolean!
    $getReviewAssignmentTriggers: Boolean!
  ) {
    applications(condition: { serial: $serial }, first: 1) @include(if: $getApplicationTriggers) {
      nodes {
        id
        trigger
      }
    }
    reviewAssignments(condition: { id: $reviewAssignmentId }, first: 1)
      @include(if: $getReviewAssignmentTriggers) {
      nodes {
        id
        trigger
      }
    }
    reviews(condition: { id: $reviewId }, first: 1) @include(if: $getReviewTriggers) {
      nodes {
        id
        trigger
      }
    }
  }
`
// Add more tables trigger fields when required
