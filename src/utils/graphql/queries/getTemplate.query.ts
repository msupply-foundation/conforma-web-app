import { gql } from '@apollo/client'

export default gql`
  query getTemplate($code: String!, $status: TemplateStatus = AVAILABLE) {
    templates(condition: { code: $code, status: $status }) {
      nodes {
        ...templateFragment
        templateSections(orderBy: INDEX_ASC) {
          nodes {
            ...Section
            templateElementsBySectionId {
              nodes {
                ...elementFragment
              }
            }
          }
        }
        templateStages {
          nodes {
            id
            number
            title
            description
          }
        }
      }
    }
  }
`
