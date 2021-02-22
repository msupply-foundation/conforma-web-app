import { gql } from '@apollo/client'

export default gql`
  query getAllResponses($serial: String!) {
    applicationBySerial(serial: $serial) {
      applicationResponses {
        nodes {
          ...Response
        }
      }
    }
  }
`
