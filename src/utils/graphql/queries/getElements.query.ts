import { gql } from '@apollo/client'

export default gql`
  query getElements($sectionId: Int!) {
    templateElements(filter: { sectionId: { equalTo: $sectionId } }) {
      nodes {
        category
        code
        visibilityCondition
        nextElementCode
        parameters
        title
        sectionId
      }
    }
  }
`
