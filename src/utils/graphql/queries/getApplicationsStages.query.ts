import { gql } from '@apollo/client'

export default gql`
  query getApplicationsStages($serials: [String!]) {
    applicationStageStatusAlls(
      filter: { serial: { in: $serials } }
      condition: { stageIsCurrent: true }
    ) {
      nodes {
        serial
        stageHistoryId
        stage
        stageId
        stageNumber
        statusHistoryTimeCreated
      }
    }
  }
`
