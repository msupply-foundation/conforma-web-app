import { gql } from '@apollo/client'

export default gql`
  query getApplications(
    $filters: ApplicationFilter
    $sortFields: [ApplicationsOrderBy!]
    $paginationOffset: Int!
    $numberToFetch: Int!
  ) {
    applications(
      filter: $filters
      orderBy: $sortFields
      offset: $paginationOffset
      first: $numberToFetch
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
