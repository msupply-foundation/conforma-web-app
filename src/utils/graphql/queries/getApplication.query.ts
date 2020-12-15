import { gql } from '@apollo/client'

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
    applicationStageStatusAlls(condition: { serial: $serial, stageIsCurrent: true }) {
      nodes {
        serial
        stageHistoryId
        stage
        stageId
        stageNumber
      }
    }
  }
`
