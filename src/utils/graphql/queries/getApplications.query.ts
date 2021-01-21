import { gql } from '@apollo/client'

export default gql`
  query getApplications($code: String!) {
    applications(
      filter: { template: { code: { equalTo: $code }, and: { status: { equalTo: AVAILABLE } } } }
    ) {
      nodes {
        ...Application
        template {
          ...Template
        }
      }
    }
  }
`
