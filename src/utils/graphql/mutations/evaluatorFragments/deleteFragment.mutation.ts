import { gql } from '@apollo/client'

export default gql`
  mutation deleteEvaluatorFragment($id: Int!) {
    deleteEvaluatorFragment(input: { id: $id }) {
      evaluatorFragment {
        id
      }
    }
  }
`
