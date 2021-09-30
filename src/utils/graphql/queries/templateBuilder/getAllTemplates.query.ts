import { gql } from '@apollo/client'

export default gql`
  query getAllTemplates($languageCode: String! = "") {
    templates {
      nodes {
        code
        status
        id
        version
        versionTimestamp
        name
        status
        templateCategory {
          title
        }
        customLocalisations(condition: { languageCode: $languageCode }) {
          nodes {
            languageCode
            strings
          }
        }
        applications(filter: { isConfig: { equalTo: false } }) {
          totalCount
        }
      }
    }
  }
`
