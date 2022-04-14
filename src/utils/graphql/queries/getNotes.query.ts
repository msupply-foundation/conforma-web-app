import { gql } from '@apollo/client'

export default gql`
  query getApplicationNotes($applicationId: Int!) {
    applicationNotes(condition: { applicationId: $applicationId }, orderBy: TIMESTAMP_DESC) {
      nodes {
        id
        comment
        org {
          id
          name
        }
        user {
          fullName
          id
          username
        }
        files {
          nodes {
            filePath
            description
            id
            originalFilename
            uniqueId
          }
        }
        timestamp
      }
    }
  }
`
