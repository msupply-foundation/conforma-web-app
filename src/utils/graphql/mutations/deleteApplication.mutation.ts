import { gql } from '@apollo/client'

export default gql`
  mutation deleteApplication($id: Int!) {
    deleteApplication(input: { id: $id }) {
      clientMutationId
    }
  }
`
