import { gql } from '@apollo/client'

export default gql`
  query getTemplates($status: TemplateStatus = AVAILABLE) {
    templates(condition: { status: $status }) {
      nodes {
        ...Template
      }
    }
  }
`
