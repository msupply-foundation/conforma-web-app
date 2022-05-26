import { gql } from '@apollo/client'

export default gql`
  query getAllLookupTableStructures {
    dataTables(condition: { isLookupTable: true }) {
      nodes {
        id
        tableName
        displayName
        fieldMap
      }
    }
  }
`
