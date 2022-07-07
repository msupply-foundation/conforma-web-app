import { gql } from '@apollo/client'

export default gql`
  query getRefDocs {
    files(
      filter: {
        or: [
          { isInternalReferenceDoc: { equalTo: true } }
          { isExternalReferenceDoc: { equalTo: true } }
        ]
      }
    ) {
      nodes {
        uniqueId
        description
        isInternalReferenceDoc
        isExternalReferenceDoc
      }
    }
  }
`
