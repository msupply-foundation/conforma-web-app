import { gql } from '@apollo/client'

export default gql`
  query EvaluatorFragments {
    evaluatorFragments {
      nodes {
        ...evaluatorFragment
      }
    }
  }
`
