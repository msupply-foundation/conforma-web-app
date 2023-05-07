import { gql } from '@apollo/client'

export default gql`
  query getColumnDefinitions($tableName: String!) {
    dataViewColumnDefinitions(condition: { tableName: $tableName }, orderBy: COLUMN_NAME_ASC) {
      nodes {
        ...dataViewColumnDefinitionFragment
      }
    }
  }
`
