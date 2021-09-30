import { gql } from '@apollo/client'

export default gql`
  query getTemplates($status: TemplateStatus = AVAILABLE, $langCode: String! = "") {
    templates(condition: { status: $status }) {
      nodes {
        ...templateFragment
      }
    }
  }
`
