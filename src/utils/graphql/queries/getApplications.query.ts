import { gql } from '@apollo/client'

export default gql`
  query getApplications($filters: ApplicationFilter, $sortFields: [ApplicationsOrderBy!]) {
    applications(filter: $filters, orderBy: $sortFields) {
      nodes {
        ...Application
        template {
          ...Template
        }
      }
    }
  }
`
