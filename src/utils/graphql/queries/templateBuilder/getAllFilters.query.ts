import { gql } from '@apollo/client'

export default gql`
  query getAllFilters {
    filters {
      nodes {
        code
        id
        query
        title
        userRole
      }
    }
  }
`
