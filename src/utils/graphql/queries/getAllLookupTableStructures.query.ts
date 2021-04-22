import { gql } from '@apollo/client'

export default gql`
  query getAllLookupTableStructures {
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
