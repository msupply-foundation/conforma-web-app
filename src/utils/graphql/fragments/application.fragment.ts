import { gql } from '@apollo/client'

export default gql`
  fragment Application on Application {
    serial
    name
    stage
    status
    outcome
  }
`