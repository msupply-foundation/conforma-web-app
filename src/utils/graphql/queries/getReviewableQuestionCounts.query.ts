import { gql } from '@apollo/client'

export default gql`
  query getReviewableQuestionCounts($applicationId: Int!, $stageId: Int!, $levelNumber: Int!) {
    reviewableQuestions(appId: $applicationId) {
      totalCount
    }
    assignedQuestions(
      appId: $applicationId
      stageId: $stageId
      levelNumber: $levelNumber
      filter: { or: [{ decision: { equalTo: APPROVE } }, { decision: { equalTo: AGREE } }] }
    ) {
      totalCount
    }
  }
`
