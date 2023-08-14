import { gql } from '@apollo/client'

export default gql`
  query getFilteredApplicationCount($filter: ApplicationListShapeFilter, $userId: Int! = 0) {
    applicationList(filter: $filter, userid: $userId) {
      totalCount
    }
  }
`
