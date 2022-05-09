import { gql } from '@apollo/client'

export default gql`
  query getAllLookupTableStructures {
    dataTables {
      nodes {
        id
        tableName
        name
        fieldMap
      }
    }
  }
`
