import { gql } from '@apollo/client'

export default gql`
  fragment templateFragment on Template {
    code
    id
    name
    status
    namePlural
    isLinear
    isInteractive
    startMessage
    submissionMessage
    version
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
