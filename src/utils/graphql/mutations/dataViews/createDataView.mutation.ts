import { gql } from '@apollo/client'

export default gql`
  mutation createDataView(
    $identifier: String!
    $tableName: String!
    $code: String!
    $detailViewHeaderColumn: String!
  ) {
    createDataView(
      input: {
        dataView: {
          identifier: $identifier
          tableName: $tableName
          code: $code
          detailViewHeaderColumn: $detailViewHeaderColumn
        }
      }
    ) {
      dataView {
        ...dataViewFragment
      }
    }
  }
`
