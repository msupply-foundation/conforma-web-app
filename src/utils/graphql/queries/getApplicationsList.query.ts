import { gql } from '@apollo/client'

export default gql`
  query getApplicationList(
    $filters: ApplicationListShapeFilter
    $sortFields: [ApplicationListShapesOrderBy!]
    $paginationOffset: Int
    $numberToFetch: Int
    $userId: Int! = 0
    $templateCode: String!
  ) {
    applicationList(
      filter: $filters
      orderBy: $sortFields
      offset: $paginationOffset
      first: $numberToFetch
      userid: $userId
    ) {
      nodes {
        id
        serial
        name
        templateCode
        templateName
        applicant
        orgName
        stage
        stageColour
        status
        outcome
        lastActiveDate
        applicantDeadline
        reviewerAction
        assignerAction
        assigners
        reviewers
      }
      # Use the page and count info for rendering Pagination UI
      pageInfo {
        hasPreviousPage
        hasNextPage
      }
      totalCount
    }
    templates(condition: { status: AVAILABLE, code: $templateCode }) {
      nodes {
        code
        name
        namePlural
      }
    }
  }
`
