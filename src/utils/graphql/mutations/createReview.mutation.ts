import { gql } from '@apollo/client'

export default gql`
  mutation createReview(
    $reviewAssigmentId: Int!
    $trigger: Trigger = ON_REVIEW_CREATE
    $applicationResponses: [ReviewResponseReviewIdFkeyReviewResponseCreateInput!]
  ) {
    createReview(
      input: {
        review: {
          reviewAssignmentId: $reviewAssigmentId
          trigger: $trigger
          reviewResponsesUsingId: { create: $applicationResponses }
        }
      }
    ) {
      review {
        id
      }
    }
  }
`
