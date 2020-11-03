import { gql } from '@apollo/client'

export default gql`
  query getResponses($serial: String!) {
    applicationBySerial(serial: $serial) {
      applicationResponses {
        nodes {
          value
          id
          templateElement {
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
`
