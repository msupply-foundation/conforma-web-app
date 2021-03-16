import { gql } from '@apollo/client'

export default gql`
  query($lookupTableID: Int!) {
    lookupTable(id: $lookupTableID) {
      id
      label
      name
      fieldMap
    }
  }
`
