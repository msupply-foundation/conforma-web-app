import { gql } from '@apollo/client'

export default gql`
  query getApplications {
    applications {
      nodes {
        ...Application
        template {
          ...Template
        }
      }
    }
    applicationStageStatusAlls( condition: { stageIsCurrent: true } ) {
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