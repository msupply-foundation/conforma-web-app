import { gql } from '@apollo/client'

export default gql`
  mutation createEvaluatorFragment(
    $name: String!
    $expression: JSON!
    $metadata: JSON
    $permissionNames: [String!]
    $backEnd: Boolean!
    $frontEnd: Boolean!
  ) {
    createEvaluatorFragment(
      input: {
        evaluatorFragment: {
          name: $name
          expression: $expression
          metadata: $metadata
          permissionNames: $permissionNames
          backEnd: $backEnd
          frontEnd: $frontEnd
        }
      }
    ) {
      evaluatorFragment {
        ...evaluatorFragment
      }
    }
  }
`
