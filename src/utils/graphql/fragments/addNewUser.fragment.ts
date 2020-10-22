import { gql } from '@apollo/client'

export default gql`
  fragment addNewUser on User {
    id
    username
  }
`
