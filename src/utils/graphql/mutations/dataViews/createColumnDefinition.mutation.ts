import { gql } from '@apollo/client'

export default gql`
  mutation createColumnDefinition($tableName: String!, $columnName: String!) {
    createDataViewColumnDefinition(
      input: { dataViewColumnDefinition: { tableName: $tableName, columnName: $columnName } }
    ) {
      dataViewColumnDefinition {
        ...dataViewColumnDefinitionFragment
      }
    }
  }
`
