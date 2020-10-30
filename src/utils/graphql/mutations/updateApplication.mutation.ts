import { gql } from '@apollo/client'

export default gql`
  mutation updateApplication($id: Int!, $applicationTrigger: Trigger!) {
    updateApplication(input: { id: $id, patch: { trigger: $applicationTrigger } }) {
      application {
        id
        trigger
      }
    }
  }
`
