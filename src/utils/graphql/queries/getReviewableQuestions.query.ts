import { gql } from '@apollo/client'

export default gql`
  query getReviewableQuestions($applicationId: Int!, $stageId: Int!, $levelNumber: Int!) {
    reviewableQuestions(appId: $applicationId) {
      totalCount
    }
    assignedQuestions(appId: $applicationId, stageId: $stageId, levelNumber: $levelNumber) {
      totalCount
    }
    submittedAssignedQuestionsCount(
      appId: $applicationId
      stageId: $stageId
      levelNumber: $levelNumber
    )
  }
`
