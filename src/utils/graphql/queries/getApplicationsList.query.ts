import { gql } from '@apollo/client'

export default gql`
  query getApplicationsList(
    $filters: ApplicationListFilter
    $sortFields: [ApplicationListsOrderBy!]
    $paginationOffset: Int!
    $numberToFetch: Int!
  ) {
    applicationLists(
      filter: $filters
      orderBy: $sortFields
      offset: $paginationOffset
      first: $numberToFetch
    ) {
      nodes {
        id
        serial
        name
        templateCode
        templateName
        applicant
        applicantFirstName
        applicantLastName
        applicantUsername
        orgName
        stage
        status
        outcome
        lastActiveDate
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
