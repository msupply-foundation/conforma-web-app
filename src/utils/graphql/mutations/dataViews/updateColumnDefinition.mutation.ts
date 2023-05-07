import { gql } from '@apollo/client'

export default gql`
  mutation updateColumnDefinition($id: Int!, $patch: DataViewColumnDefinitionPatch!) {
    updateDataViewColumnDefinition(input: { patch: $patch, id: $id }) {
      dataViewColumnDefinition {
        ...dataViewColumnDefinitionFragment
      }
    }
  }
`
