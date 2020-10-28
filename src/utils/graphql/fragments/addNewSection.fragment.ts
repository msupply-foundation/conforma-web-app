import { gql } from '@apollo/client'

export default gql`
  fragment addNewSection on ApplicationSection {
    id
    applicationId
    templateSectionId
  }
`
