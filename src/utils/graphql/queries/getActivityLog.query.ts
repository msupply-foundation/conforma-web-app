import { gql } from '@apollo/client'

export default gql`
  query getActivityLog($appId: Int) {
    activityLogs(condition: { applicationId: $appId }, orderBy: TIMESTAMP_ASC) {
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
