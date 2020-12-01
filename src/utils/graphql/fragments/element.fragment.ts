import { gql } from '@apollo/client'

export default gql`
  fragment Element on TemplateElement {
    id
    title
    elementTypePluginCode
    code
    category
    index
    isEditable
    isRequired
    parameters
    visibilityCondition
  }
`
