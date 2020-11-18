import { gql } from '@apollo/client'

export default gql`
  mutation createApplication($name: String!, $serial: String!, $templateId: Int!,
  $outcome: ApplicationOutcome = PENDING, $trigger: Trigger = ON_APPLICATION_CREATE ) {
    createApplication(
      input: {
        application: {
          name: $name
          serial: $serial
          templateId: $templateId
          isActive: true
          outcome: $outcome
          trigger: $trigger
        }
      }
    ) {
      application {
        ...Application
        template {
          ...Template
          templateSections {
            nodes {
              ...Section
            }
          }
        }
      }
    }
  }
`
