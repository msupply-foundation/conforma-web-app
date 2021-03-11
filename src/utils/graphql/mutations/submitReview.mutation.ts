import { gql } from '@apollo/client'

export default gql`
  mutation updateReview(
    $reviewId: Int!
    $trigger: Trigger = ON_REVIEW_SUBMIT
    $reviewResponses: [ReviewResponseOnReviewResponseForReviewResponseReviewIdFkeyUsingReviewResponsePkeyUpdate!]
  ) {
    updateReview(
      input: {
        id: $reviewId
        patch: { trigger: $trigger, reviewResponsesUsingId: { updateById: $reviewResponses } }
      }
    ) {
      review {
        id
        trigger
      }
    }
  }
`
