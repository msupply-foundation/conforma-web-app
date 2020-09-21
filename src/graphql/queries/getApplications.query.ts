import { gql } from '@apollo/client'

export default gql`
  query getApplications {
    applications {
      nodes {
        id
        serial
        name
        outcome
        template {
          code
          id
          templateName
        }
      }
    }
  }
`
