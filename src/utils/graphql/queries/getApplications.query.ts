import { gql } from '@apollo/client'

export default gql`
  query getApplications($filters: ApplicationFilter) {
    applications(filter: $filters, orderBy: [SERIAL_DESC]) {
      nodes {
        ...Application
        template {
          ...Template
        }
      }
    }
  }
`
