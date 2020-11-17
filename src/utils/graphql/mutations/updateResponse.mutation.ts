import { gql } from '@apollo/client'

export default gql`
  mutation updateResponse($id: Int!, $value: JSON!) {
    updateApplicationResponse(
      input: { id: $id, patch: { value: $value } }
    ) {
      applicationResponse {
        ...Response
        templateElement {
          ...Element
        }
      }
    }
  }
`