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
      applicationStageHistories(condition: {isCurrent: true}) {
        nodes {
          id
        }
      }
    }
  }
`
