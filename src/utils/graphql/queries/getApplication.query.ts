import { gql } from '@apollo/client'

// TODO: Remove this

export default gql`
  query getApplication($serial: String!) {
    applicationBySerial(serial: $serial) {
      ...Application
      applicationResponses {
        nodes {
          ...Response
        }
      }
      template {
        ...Template
        templateStages {
          nodes {
            ...TemplateStage
          }
        }
      }
      applicationSections {
        nodes {
          id
          templateSection {
            ...Section
            templateElementsBySectionId {
              nodes {
                ...Element
              }
            }
          }
        }
      }
    }
  }
`
