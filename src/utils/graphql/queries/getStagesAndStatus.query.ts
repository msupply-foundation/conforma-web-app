import { gql } from '@apollo/client'

export default gql`
  query getStagesAndStatus($serial: String!) {
    applicationBySerial(serial: $serial) {
      status
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
