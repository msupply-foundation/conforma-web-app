import { gql } from '@apollo/client'

export default gql`
  query getDataViews($tableName: String!) {
    dataViews(condition: { tableName: $tableName }, orderBy: TABLE_NAME_ASC) {
      nodes {
        ...dataViewFragment
      }
    }
  }
`
