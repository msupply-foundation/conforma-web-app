import { gql } from '@apollo/client'

export default gql`
  query getLookupTableStructureById($lookupTableID: Int!) {
    dataTable(id: $lookupTableID) {
      id
      displayName
      tableName
      fieldMap
      dataViewCode
    }
  }
`
