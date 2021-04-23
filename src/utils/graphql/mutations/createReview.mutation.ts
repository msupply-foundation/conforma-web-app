import { gql } from '@apollo/client'

export default gql`
  mutation createReview($reviewInput: ReviewInput!) {
    createReview(input: { review: $reviewInput }) {
      review {
        id
        reviewAssignment {
          id
          reviews {
            nodes {
              id
            }
          }
        }
      }
    }
  }
`
