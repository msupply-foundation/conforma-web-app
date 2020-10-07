import { gql } from '@apollo/client'

export default gql`
  mutation createUser($email: String!, $password: String!, $username: String!) {
    createUser(input: { user: { email: $email, password: $password, username: $username } }) {
      user {
        id
        username
      }
    }
  }
`
