import { gql } from '@apollo/client'

export default gql`
    query getReviewAssignment() {
        reviews()
    }
`