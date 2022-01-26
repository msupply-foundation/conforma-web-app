import { gql } from '@apollo/client'

export default gql`
  query getActivityLog($applicationId: Int!) {
    activityLogs(condition: { applicationId: $applicationId }, orderBy: TIMESTAMP_ASC) {
      nodes {
        value
        type
        timestamp
        table
        recordId
        nodeId
        id
        details
        applicationId
      }
    }
  }
`
