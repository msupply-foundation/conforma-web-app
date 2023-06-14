import { gql } from '@apollo/client'

export default gql`
  mutation deleteColumnDefinition($id: Int!) {
    deleteDataViewColumnDefinition(input: { id: $id }) {
      dataViewColumnDefinition {
        id
      }
    }
  }
`
