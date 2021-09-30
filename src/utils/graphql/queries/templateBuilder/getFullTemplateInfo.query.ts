import { gql } from '@apollo/client'

export default gql`
  query getFullTemplateInfo($id: Int!, $langCode: String! = "") {
    template(id: $id) {
      ...FullTemplate
    }
  }
`
