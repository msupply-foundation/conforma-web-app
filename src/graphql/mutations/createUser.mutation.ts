import { gql } from '@apollo/client'
import { UserRole } from '../../generated/graphql'

export default gql`
  mutation createUser($email: String!, $password: String!, $username: String!, $role: UserRole!) {
    createUser(
      input: { user: { email: $email, password: $password, username: $username, role: $role } }
    ) {
      user {
        id
        username
      }
    }
  }
`
