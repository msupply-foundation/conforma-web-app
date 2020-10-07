import { gql } from '@apollo/client'

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
            templateElementsBySectionId {
              totalCount
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
