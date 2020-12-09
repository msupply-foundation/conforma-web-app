import { gql } from '@apollo/client'

export default gql`
  query getReview($reviewId: Int!) {
    review(id: $reviewId) {
        id
    }
  }
`