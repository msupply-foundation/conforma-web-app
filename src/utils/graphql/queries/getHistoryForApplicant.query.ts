import { gql } from '@apollo/client'

export default gql`
  query getHistoryForApplicant($serial: String!, $questionCode: String!, $templateCode: String!) {
    templateElementByTemplateCodeAndCode(code: $questionCode, templateCode: $templateCode) {
      reviewResponses(filter: { isVisibleToApplicant: { equalTo: true } }) {
        nodes {
          ...reviewResponseFragment
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
          }
        }
      }
    }
  }
`
