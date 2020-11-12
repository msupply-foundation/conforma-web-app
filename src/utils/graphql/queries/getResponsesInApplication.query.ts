import { gql } from '@apollo/client'

export default gql`
  query getResponsesInApplication($serial: String!) {
    applicationBySerial( serial: $serial ) {
      applicationResponses {
        nodes {
          id
          value
          timeCreated
        }
      }
    }
  }
`