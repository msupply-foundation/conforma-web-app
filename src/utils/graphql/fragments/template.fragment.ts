import { gql } from '@apollo/client'

export default gql`
  fragment templateFragment on Template {
    code
    id
    name
    status
    namePlural
    isLinear
    canApplicantMakeChanges
    startMessage
    submissionMessage
    version
    versionId
    serialPattern
    icon
    templateCategory {
      id
      code
      title
      icon
      uiLocation
    }
    templateFilterJoins {
      nodes {
        id
        filter {
          id
          code
          query
          title
          userRole
        }
      }
    }
    applications(filter: { isConfig: { equalTo: false } }) {
      totalCount
    }
  }
`
