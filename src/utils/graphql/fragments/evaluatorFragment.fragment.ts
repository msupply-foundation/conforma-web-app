import { gql } from '@apollo/client'

export default gql`
  fragment evaluatorFragment on EvaluatorFragment {
    id
    name
    expression
    metadata
    permissionNames
    backEnd
    frontEnd
  }
`
