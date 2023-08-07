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
        templateCategory {
          title
        }
        applications(filter: { isConfig: { equalTo: false } }) {
          totalCount
        }
      }
    }
  }
`
