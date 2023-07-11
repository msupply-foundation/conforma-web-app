import { gql } from '@apollo/client'

export default gql`
  query getTemplateCategories {
    templateCategories(orderBy: CODE_ASC) {
      nodes {
        code
        icon
        id
        title
        uiLocation
        isSubmenu
      }
    }
  }
`
