import { gql } from '@apollo/client'

export default gql`
  mutation deleteTemplate($id: Int!) {
    deleteTemplate(input: { id: $id }) {
      clientMutationId
    }
  }
`
