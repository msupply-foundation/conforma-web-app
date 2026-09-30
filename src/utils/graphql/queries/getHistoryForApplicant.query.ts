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
      # Filtered via applicationResponse rather than review, as RLS hides the
      # review row from applicants
      reviewResponses(
        filter: {
          isVisibleToApplicant: { equalTo: true }
          applicationResponse: { application: { serial: { equalTo: $serial } } }
        }
      ) {
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
