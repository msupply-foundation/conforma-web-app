import { gql } from '@apollo/client'

export default gql`
  query getAllActions {
    actionPlugins(orderBy: NAME_ASC) {
      nodes {
        id
        code
        description
        name
        optionalParameters
        outputProperties
        requiredParameters
      }
    }
  }
`
