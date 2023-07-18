import { gql } from '@apollo/client'

export default gql`
  query getHistoryForApplicant(
    $serial: String!
    $questionCode: String!
    $templateCode: String!
    $templateVersionId: String!
  ) {
    templateElementByTemplateCodeAndCodeAndTemplateVersion(
      code: $questionCode
      templateCode: $templateCode
      templateVersion: $templateVersionId
    ) {
      ...elementFragment
      reviewResponses(filter: { isVisibleToApplicant: { equalTo: true } }) {
        nodes {
          ...reviewResponseFragment
          review {
            stageNumber
          }
        }
      }
      applicationResponses(filter: { application: { serial: { equalTo: $serial } } }) {
        nodes {
          ...applicationResponseFragment
          application {
            ...Application
            user {
              ...User
            }
            stageNumber
          }
        }
      }
    }
  }
`
