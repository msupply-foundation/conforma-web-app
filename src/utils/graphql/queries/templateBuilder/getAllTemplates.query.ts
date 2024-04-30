import { gql } from '@apollo/client'

export default gql`
  query getAllTemplates {
    templates {
      nodes {
        code
        status
        id
        versionId
        versionTimestamp
        parentVersionId
        versionComment
        versionHistory
        name
        status
        priority
        templateCategory {
          title
          priority
        }
        applications(filter: { isConfig: { equalTo: false } }) {
          totalCount
        }
      }
    }
  }
`
