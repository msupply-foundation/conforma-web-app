import { gql } from '@apollo/client'

export default gql`
  mutation updateApplication($id: Int!, $applicationName: String!) {
    updateApplication(input: { id: $id, patch: { name: $applicationName } }) {
      application {
        id
        name
      }
    }
  }
`
