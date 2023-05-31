import { gql } from '@apollo/client'

export default gql`
  mutation deleteDataView($id: Int!) {
    deleteDataView(input: { id: $id }) {
      dataView {
        id
      }
    }
  }
`
