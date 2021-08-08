import { gql } from '@apollo/client'

export default gql`
  query getTemplateCategories {
    templateCategories {
      nodes {
        code
        icon
        id
        title
      }
    }
  }
`
