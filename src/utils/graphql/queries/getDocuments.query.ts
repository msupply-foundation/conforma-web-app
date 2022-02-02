import { gql } from '@apollo/client'

export default gql`
  query getApplicationDocs($applicationSerial: String!) {
    files(condition: { applicationSerial: $applicationSerial, isOutputDoc: true }) {
      nodes {
        description
        filePath
        originalFilename
        thumbnailPath
        timestamp
      }
    }
  }
`
