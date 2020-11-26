import { gql } from '@apollo/client'

export default gql`
  query getSectionElementsAndResponses($serial: String!, $sectionId: Int!) {
    applicationBySerial(serial: $serial) {
      ...Application,
      applicationResponses {
        nodes {
          ...Response
          templateElement {
            code
          }
        }
      }
      template {
        templateSections(condition: {id: $sectionId}) {
          nodes {
            ...Section
            templateElementsBySectionId {
              nodes {
                ...Element
              }
            }
          }
        }
      }
    }
  }
`
