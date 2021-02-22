import { gql } from '@apollo/client'

export default gql`
  query getApplicationNew($serial: String!) {
    applicationBySerial(serial: $serial) {
      ...Application
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
    applicationStageStatusAlls(
      condition: { serial: $serial, stageIsCurrent: true, statusIsCurrent: true }
    ) {
      nodes {
        ...Stage
      }
    }
  }
`
