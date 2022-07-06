import { gql } from '@apollo/client'

export default gql`
  query getRefDocs {
    files(filter: { isReferenceDoc: { equalTo: true } }) {
      nodes {
        uniqueId
        description
      }
    }
  }
`
