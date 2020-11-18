import { gql } from '@apollo/client'

export default gql`
  mutation updateApplication($serial: String!, $applicationTrigger: Trigger = ON_APPLICATION_SUBMIT,
  $responses: [ApplicationResponseOnApplicationResponseForApplicationResponseApplicationIdFkeyUsingApplicationResponsePkeyUpdate!]) {
    updateApplicationBySerial(
        input: { 
          serial: $serial, 
          patch: { 
            trigger: $applicationTrigger 
            applicationResponsesUsingId: {
              updateById: $responses
            }
          }
        }
      ) {
      application {
        ...Application
      }
    }
  }
`