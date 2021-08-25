import { gql } from '@apollo/client'

export default gql`
  query getHistoryForReviewer(
    $serial: String!
    $questionCode: String!
    $templateCode: String!
    $templateVersion: Int!
    $userId: Int!
  ) {
    templateElementByTemplateCodeAndCodeAndTemplateVersion(
      code: $questionCode
      templateCode: $templateCode
      templateVersion: $templateVersion
    ) {
      ...elementFragment
      reviewResponses(
        filter: {
          review: {
            application: { serial: { equalTo: $serial } }
            # levelNumber: { lessThanOrEqualTo: $userLevel }
          }
          or: [
            { status: { equalTo: SUBMITTED } }
            {
              and: [
                { status: { equalTo: DRAFT } }
                { review: { reviewer: { id: { equalTo: $userId } } } }
              ]
            }
          ]
        }
      ) {
        nodes {
          ...reviewResponseFragment
          review {
            stageNumber
          }
        }
      }
      applicationResponses(
        filter: { application: { serial: { equalTo: $serial } }, status: { equalTo: SUBMITTED } }
      ) {
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
