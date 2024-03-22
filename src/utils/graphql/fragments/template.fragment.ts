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
    versionId
    serialPattern
    icon
    dashboardRestrictions
    priority
    templateCategory {
      id
      code
      title
      icon
      uiLocation
      isSubmenu
      priority
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
