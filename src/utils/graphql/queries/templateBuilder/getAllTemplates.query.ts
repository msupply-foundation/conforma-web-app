import { gql } from '@apollo/client'

export default gql`
  query getAllTemplates {
    templates {
      nodes {
        code
        status
        id
        version
        versionId
        versionTimestamp
        parentVersionId
        versionExportComment
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
