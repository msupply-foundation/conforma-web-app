import { gql } from '@apollo/client'

export default gql`
  mutation updateDataViewColumnDefinition($id: Int!, $patch: DataViewColumnDefinitionPatch!) {
    updateDataViewColumnDefinition(input: { patch: $patch, id: $id }) {
      dataViewColumnDefinition {
        ...dataViewColumnDefinitionFragment
      }
    }
  }
`
