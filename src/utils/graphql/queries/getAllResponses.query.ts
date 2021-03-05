import { gql } from '@apollo/client'

// TODO, filter by is visible (review response)
export default gql`
  query getAllResponses($serial: String!) {
    applicationBySerial(serial: $serial) {
      id
      serial
      applicationResponses {
        nodes {
          ...Response
          reviewResponses {
            nodes {
              ...reviewResponseFragment
            }
          }
        }
      }
    }
  }
`
