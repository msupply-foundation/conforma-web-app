import { gql } from '@apollo/client'

export default gql`
  query getLookupTableStructureById($lookupTableID: Int!) {
    lookupTable(id: $lookupTableID) {
      id
      label
      name
      fieldMap
    }
  }
`
