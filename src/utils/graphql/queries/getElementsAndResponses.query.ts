import { gql } from '@apollo/client'

export default gql`
  query getElementsAndResponses($serial: String!) {
    applicationBySerial(serial: $serial) {
      applicationResponses {
        nodes {
          id
          value
          templateElement {
            code
          }
        }
      }
      template {
        templateSections {
          nodes {
            templateElementsBySectionId {
              nodes {
                id
                code
                category
                isEditable
                isRequired
                validation
                validationMessage
                visibilityCondition
              }
            }
          }
        }
      }
    }
  }
`
