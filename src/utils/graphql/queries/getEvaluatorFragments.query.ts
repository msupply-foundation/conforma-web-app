import { gql } from '@apollo/client'

export default gql`
  query getEvaluatorFragments {
    evaluatorFragments {
      nodes {
        id
        name
        expression
        metadata
        frontEnd
        backEnd
        permissionNames
      }
    }
  }
`
