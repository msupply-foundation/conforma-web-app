import { gql } from '@apollo/client'

export default gql`
  mutation updateEvaluatorFragment($id: Int!, $patch: EvaluatorFragmentPatch!) {
    updateEvaluatorFragment(input: { patch: $patch, id: $id }) {
      evaluatorFragment {
        ...evaluatorFragment
      }
    }
  }
`
