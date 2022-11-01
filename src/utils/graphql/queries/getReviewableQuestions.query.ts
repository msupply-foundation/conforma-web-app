import { gql } from '@apollo/client'

export default gql`
  query getReviewableQuestions($applicationId: Int!, $stageId: Int!, $levelNumber: Int!) {
    reviewableQuestions(appId: $applicationId) {
      totalCount
    }
    assignedQuestions(
      appId: $appId
      stageId: $stageId
      levelNumber: $levelNumber
      filter: { or: [{ decision: { equalTo: APPROVE } }, { decision: { equalTo: AGREE } }] }
    ) {
      totalCount
    }
  }
`
