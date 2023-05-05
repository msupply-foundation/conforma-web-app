import { gql } from '@apollo/client'

export default gql`
  query getDataTables {
    dataTables {
      nodes {
        tableName
        id
        isLookupTable
        displayName
      }
    }
  }
`
