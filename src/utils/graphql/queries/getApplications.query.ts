import { gql } from '@apollo/client'

export default gql`
  query getApplications {
    applications {
      nodes {
        ...Application
        template {
          ...Template
        }
        applicationStageHistories(condition: {isCurrent: true}) {
          nodes {
            id
          }
        }
      }
    }
  }
`