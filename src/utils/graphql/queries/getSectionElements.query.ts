import { gql } from '@apollo/client'

export default gql`
  query getSectionElements($sectionId: Int!) {
    templateElements(condition: { sectionId: $sectionId }) {
      nodes {
        category
        code
        index
        elementTypePluginCode
        visibilityCondition
        parameters
        title
        sectionId
      }
    }
  }
`
