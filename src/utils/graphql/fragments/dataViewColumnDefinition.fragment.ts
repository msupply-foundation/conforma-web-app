import { gql } from '@apollo/client'

export default gql`
  fragment dataViewColumnDefinitionFragment on DataViewColumnDefinition {
    id
    tableName
    columnName
    title
    elementTypePluginCode
    elementParameters
    additionalFormatting
    valueExpression
    sortColumn
    filterParameters
    filterExpression
    filterDataType
    hideIfNull
  }
`
