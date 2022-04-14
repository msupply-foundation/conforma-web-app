import { gql } from '@apollo/client'

export default gql`
  mutation createNote($applicationId: Int!, $userId: Int!, $orgId: Int, $comment: String!) {
    createApplicationNote(
      input: {
        applicationNote: {
          comment: $comment
          applicationId: $applicationId
          orgId: $orgId
          userId: $userId
        }
      }
    ) {
      applicationNote {
        id
        timestamp
        comment
      }
    }
  }
`
