import { gql } from '@apollo/client'

export default gql`
  fragment Template on Template {
    code
    id
    name
    status
    namePlural
    isLinear
    startMessage
    submissionMessage
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
