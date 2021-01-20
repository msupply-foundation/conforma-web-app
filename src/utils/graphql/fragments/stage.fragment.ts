import { gql } from '@apollo/client'

export default gql`
  fragment Stage on ApplicationStageStatusAll {
    serial
    stageHistoryId
    stage
    stageId
    stageNumber
    status
    statusHistoryTimeCreated
  }
`
