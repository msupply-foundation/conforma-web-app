import { gql } from '@apollo/client'

export default gql`
  mutation createDataView($tableName: String!, $code: String!, $detailViewHeaderColumn: String!) {
    createDataView(
      input: {
        dataView: {
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
