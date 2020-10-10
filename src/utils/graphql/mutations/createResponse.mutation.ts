import { gql } from '@apollo/client'

export default gql`
  mutation createResponse($applicationId: Int!, $templateElementId: Int!, $timeCreated: Datetime!) {
    createApplicationResponse(
      input: {
        applicationResponse: {
          applicationId: $applicationId
          templateElementId: $templateElementId
          timeCreated: $timeCreated
        }
      }
    ) {
      applicationResponse {
        id
        value
        templateElement {
          code
        }
      }
    }
  }
`
