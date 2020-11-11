import { gql } from '@apollo/client'

export default gql`
  fragment Section on TemplateSection {
      id
      title
      code
  }
`