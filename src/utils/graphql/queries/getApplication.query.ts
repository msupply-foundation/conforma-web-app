import { gql } from '@apollo/client'

export default gql`
  query getApplication($serial: String!) {
    applicationBySerial( serial: $serial ) {
      nodes {
        ...Application
        applicationResponses {
        nodes {
          ...Response
        }
        template {
          ...Template
        }
        applicationSections {
        nodes {
          id
          templateSection {
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
