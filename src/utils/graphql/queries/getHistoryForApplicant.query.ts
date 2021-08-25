import { gql } from '@apollo/client'

export default gql`
  query getHistoryForApplicant(
    $serial: String!
    $questionCode: String!
    $templateCode: String!
    $templateVersion: Int!
  ) {
    templateElementByTemplateCodeAndCodeAndTemplateVersion(
      code: $questionCode
      templateCode: $templateCode
      templateVersion: $templateVersion
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
