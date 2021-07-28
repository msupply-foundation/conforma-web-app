import { gql } from '@apollo/client'

export default gql`
  mutation updateTemplateFilterJoin($id: Int!, $filterJoinPatch: TemplateFilterJoinPatch!) {
    updateTemplateFilterJoin(input: { patch: $filterJoinPatch, id: $id }) {
      clientMutationId
      templateFilterJoin {
        id
        filterId
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
