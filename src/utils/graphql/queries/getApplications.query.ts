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
      # Use the page and count info for rendering Pagination UI
      pageInfo {
        hasPreviousPage
        hasNextPage
      }
      totalCount
    }
  }
`
