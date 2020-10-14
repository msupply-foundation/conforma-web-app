import { gql } from '@apollo/client'

export default gql`
  query getApplication($serial: Int!) {
    applications(condition: { serial: $serial }) {
      nodes {
        id
        serial
        name
        outcome
        template {
          code
          id
          name
        }
        applicationSections {
          nodes {
            id
            templateSection {
              code
              templateElementsBySectionId {
                nodes {
                  id
                  elementTypePluginCode
                }
              }
            }
          }
        }
      }
    }
  }
`
