import { gql } from '@apollo/client'

export default gql`
  mutation deleteDataViewColumnDefinition($id: Int!) {
    deleteDataViewColumnDefinition(input: { id: $id }) {
      dataViewColumnDefinition {
        id
      }
    }
  }
`
