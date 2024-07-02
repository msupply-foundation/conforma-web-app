import { gql } from '@apollo/client'

export default gql`
  mutation createDataView(
    $identifier: String!
    $tableName: String!
    $code: String!
    $detailViewHeaderColumn: String!
    $menuName: String
  ) {
    createDataView(
      input: {
        dataView: {
          identifier: $identifier
          tableName: $tableName
          code: $code
          detailViewHeaderColumn: $detailViewHeaderColumn
          menuName: $menuName
        }
      }
    ) {
      dataView {
        ...dataViewFragment
      }
    }
  }
`
