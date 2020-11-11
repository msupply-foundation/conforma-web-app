import { gql } from '@apollo/client'

export default gql`
  mutation updateApplication($serial: String!, $applicationTrigger: Trigger!) {
    updateApplicationBySerial(input: { serial: $serial, patch: { trigger: $applicationTrigger } }) {
      application {
        ...Application
      }
    }
  }
`