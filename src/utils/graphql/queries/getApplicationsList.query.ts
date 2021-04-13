import { gql } from '@apollo/client'

export default gql`
  query getApplicationList(
    $filters: ApplicationListShapeFilter
    $sortFields: [ApplicationListShapesOrderBy!]
    $paginationOffset: Int!
    $numberToFetch: Int!
    $userId: Int!
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
        applicantFirstName
        applicantLastName
        applicantUsername
        orgName
        stage
        status
        outcome
        lastActiveDate
        reviewAssignedCount
        reviewAssignedNotStartedCount
        reviewAvailableForSelfAssignmentCount
        reviewDraftCount
        reviewChangeRequestCount
        reviewSubmittedCount
        reviewPendingCount
        assignReviewerAssignedCount
        assignReviewersCount
        assignCount
        isFullyAssignedLevel1
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
