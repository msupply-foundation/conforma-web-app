import { gql } from '@apollo/client'

export default gql`
  query getUsers {
    userLists {
      nodes {
        username
      }
    }
  }
`
