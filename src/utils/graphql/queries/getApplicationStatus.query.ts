import { gql } from '@apollo/client'

export default gql`
  query getApplicationStatus($serial: String!) {
    applicationBySerial(serial: $serial) {
      status
      template {
        submissionMessage
        templateStages {
          nodes {
            ...TemplateStage
          }
        }
      }
    }
    applicationStageStatusAlls(condition: { serial: $serial, stageIsCurrent: true }) {
      nodes {
        ...Stage
      }
    }
  }
`
