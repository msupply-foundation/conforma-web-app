import { gql } from '@apollo/client'

export default gql`
  mutation createApplication($name: String!, $serial: String!, $templateId: Int!) {
    createApplication(
      input: {
        application: {
          name: $name
          serial: $serial
          templateId: $templateId
          isActive: true
          outcome: PENDING
          trigger: ON_APPLICATION_CREATE
        }
      }
    ) {
      application {
        id
        name
        serial
        template {
          id
          templateSections {
            nodes {
              id
              title
            }
          }
        }
      }
    }
  }
`
