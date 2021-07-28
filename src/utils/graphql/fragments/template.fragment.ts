import { gql } from '@apollo/client'

export default gql`
  fragment Template on Template {
    code
    id
    name
    status
    isLinear
    startMessage
    submissionMessage
    templateCategory {
      title
      icon
      code
      id
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
  }
`
