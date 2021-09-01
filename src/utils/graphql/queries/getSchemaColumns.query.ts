import { gql } from '@apollo/client'

export default gql`
  query getSchemaColumns($tableNames: [SqlIdentifier!]) {
    schemaColumns(filter: { tableName: { in: $tableNames } }) {
      nodes {
        columnName
        tableName
      }
    }
  }
`
