import { gql } from '@apollo/client'

export default gql`
  mutation updateDataView($id: Int!, $patch: DataViewPatch!) {
    updateDataView(input: { patch: $patch, id: $id }) {
      dataView {
        ...dataViewFragment
      }
    }
  }
`
