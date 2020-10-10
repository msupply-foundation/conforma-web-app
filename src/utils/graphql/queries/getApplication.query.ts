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
          templateSections {
            nodes {
              code
              id
              title
              templateElementsBySectionId {
                nodes {
                  code
                  elementTypePluginCode
                  id
                  parameters
                  sectionId
                  title
                  visibilityCondition
                }
              }
            }
          }
        }
        applicationSections {
          nodes {
            id
            templateSectionId
          }
        }
      }
    }
  }
`
