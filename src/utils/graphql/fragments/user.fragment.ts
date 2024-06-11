import { gql } from '@apollo/client'

export default gql`
  fragment User on UserList {
    id
    username
    firstName
    lastName
    fullName
    # email
    # dateOfBirth
  }
`
