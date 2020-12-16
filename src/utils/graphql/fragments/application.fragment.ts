import { gql } from '@apollo/client'

export default gql`
  fragment Application on Application {
    id
    serial
    name
    status
    outcome
  }
`
