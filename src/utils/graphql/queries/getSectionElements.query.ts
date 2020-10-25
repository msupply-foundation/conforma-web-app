import { gql } from '@apollo/client'

export default gql`
  query getSectionElements($sectionId: Int!, $applicationId: Int!) {
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
        applicationResponses(condition:{ applicationId: $applicationId }) {
          nodes {
            id
            timeCreated
            value
          }
        }
      }
    }
  }
`
