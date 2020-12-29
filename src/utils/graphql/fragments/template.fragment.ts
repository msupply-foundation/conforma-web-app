import { gql } from '@apollo/client'

export default gql`
  fragment Template on Template {
    code
    id
    name
    isLinear
    startTitle
    startMessage
    submissionMessage
  }
`
