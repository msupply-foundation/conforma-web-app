import { gql } from '@apollo/client'

export default gql`
  query getTriggers($serial: String, $reviewAssignmentId: Int, $reviewId: Int) {
    applicationTriggerStates(
      condition: { serial: $serial, reviewAssignmentId: $reviewAssignmentId, reviewId: $reviewId }
      first: 1
    ) {
      nodes {
        serial
        applicationTrigger
        reviewAssignmentTrigger
        reviewTrigger
      }
    }
  }
`
// TO-DO: optimise using @directives to only query the field specified (application, review, etc.)
// Add more tables trigger fields
