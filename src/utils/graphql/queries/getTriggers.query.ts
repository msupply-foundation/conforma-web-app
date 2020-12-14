import { gql } from '@apollo/client'

export default gql`
  query getTriggers(
    $serial: String
    $reviewId: Int
    $reviewAssignmentId: Int
    $getApplicationTriggers: Boolean!
    $getReviewAssignmentTriggers: Boolean!
    $getReviewTriggers: Boolean!
  ) {
    applicationTriggerStates(
      condition: { serial: $serial, reviewAssignmentId: $reviewAssignmentId, reviewId: $reviewId }
      first: 1
    ) {
      nodes {
        serial
        applicationTrigger @include(if: $getApplicationTriggers)
        reviewAssignmentTrigger @include(if: $getReviewAssignmentTriggers)
        reviewTrigger @include(if: $getReviewTriggers)
      }
    }
  }
`
// Add more tables trigger fields when required
