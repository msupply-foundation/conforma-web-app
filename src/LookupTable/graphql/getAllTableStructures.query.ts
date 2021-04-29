import { gql } from '@apollo/client'

export default gql`
  {
    lookupTables {
      nodes {
        id
        name
        label
        fieldMap
      }
    }
  }
`
