import { gql } from '@apollo/client'

export default gql`
  query getApplications($filters: ApplicationFilter) {
    applications(filter: $filters) {
      nodes {
        ...Application
        template {
          ...Template
        }
      }
    }
  }
`
