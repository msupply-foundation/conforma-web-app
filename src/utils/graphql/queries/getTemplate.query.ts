import { gql } from '@apollo/client'

// TODO: Update this query to use fragments!
export default gql`
  query getTemplate($code: String!, $status: TemplateStatus = AVAILABLE) {
    templates(condition: { code: $code, status: $status }) {
      nodes {
        id
        code
        name
        templateSections {
          nodes {
            id
            code
            title
            index
            templateElementsBySectionId {
              nodes {
                  code
                  category
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
        templateStages {
          nodes {
            id
            number
            title
          }
        }
      }
    }
  }
`
