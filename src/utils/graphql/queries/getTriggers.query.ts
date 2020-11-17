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
// TO-DO: optimise using @directives to only query the field specified (application, review, etc.)
// Add more tables trigger fields
