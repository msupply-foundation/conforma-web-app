import { gql } from '@apollo/client'

export default gql`
  query getApplicationsStages($serials: [String!]) {
    applicationStageStatusAlls(
      filter: { serial: { in: $serials } }
      condition: { stageIsCurrent: true }
    ) {
      nodes {
        ...Stage
      }
    }
  }
`
