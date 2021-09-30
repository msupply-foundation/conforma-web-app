import { gql } from '@apollo/client'

export default gql`
  mutation updateTemplate($id: Int!, $langCode: String! = "", $templatePatch: TemplatePatch!) {
    updateTemplate(input: { id: $id, patch: $templatePatch }) {
      template {
        ...FullTemplate
      }
    }
  }
`
