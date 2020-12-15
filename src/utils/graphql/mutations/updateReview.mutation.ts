import { gql } from '@apollo/client'

export default gql`
  mutation updateReviewResponses(
    $id: Int!
    $reviewResponses: [ReviewResponseOnReviewResponseForReviewResponseReviewIdFkeyUsingReviewResponsePkeyUpdate!]
  ) {
    updateReview(
      input: { patch: { reviewResponsesUsingId: { updateById: $reviewResponses } }, id: $id }
    ) {
      review {
        id
      }
    }
  }
`
