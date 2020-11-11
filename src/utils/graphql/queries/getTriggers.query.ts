import { gql } from '@apollo/client'

export default gql`
  query getTriggers($serial: String!) {
    applicationTriggerStates(condition: { serial: $serial }) {
      nodes {
        applicationTrigger
        reviewTrigger
        serial
      }
    }
  }
`
