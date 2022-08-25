import { gql } from '@apollo/client'

/*
This mutation is for creating application and review responses *after* the
review is already in progress. This is for when a reviewer decides to review a
question that doesn't have an applicant response.
*/

export default gql`
  mutation createReviewResponse(
    $templateElementId: Int!
    $applicationId: Int!
    $stageNumber: Int!
    $reviewId: Int!
    $decision: ReviewResponseDecision!
    $comment: String
  ) {
    createApplicationResponse(
      input: {
        applicationResponse: {
          templateElementId: $templateElementId
          value: null
          reviewResponsesUsingId: {
            create: {
              comment: $comment
              decision: $decision
              status: DRAFT
              templateElementId: $templateElementId
              reviewId: $reviewId
            }
          }
          applicationId: $applicationId
          status: SUBMITTED
          stageNumber: $stageNumber
        }
      }
    ) {
      applicationResponse {
        id
        reviewResponses {
          nodes {
            id
          }
        }
      }
    }
  }
`
