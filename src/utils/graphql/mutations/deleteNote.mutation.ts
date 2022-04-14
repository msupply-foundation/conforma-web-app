import { gql } from '@apollo/client'

export default gql`
  mutation deleteNote($noteId: Int!) {
    deleteApplicationNote(input: { id: $noteId }) {
      applicationNote {
        id
      }
    }
  }
`
