import { gql } from '@apollo/client'
import {
  GetSchemaColumnsQuery,
  OutcomeDisplayDetail,
  OutcomeDisplayTable,
} from '../../../utils/generated/graphql'
import {
  OutcomeDisplay,
  TableDisplay,
  TableQueryResult,
  DetailDisplay,
  DetailQueryResult,
  OutcomeCountQueryResult,
  ApplicationLinkQueryResult,
  SchemaColumn,
  SchemaInfo,
  GetApplicationJoinLinkTableName,
  CaseType,
} from '../../../utils/types'

import { camelCase, snakeCase } from 'lodash'

export const getColumns = (columns: { columnName: string }[], extraColumns: string[]) => {
  const columnNamesObject: { [columnName: string]: boolean } = { id: true }
  columns.forEach(({ columnName }) => (columnNamesObject[columnName] = true))
  extraColumns.forEach((columnName) => (columnNamesObject[columnName] = true))

  return Object.keys(columnNamesObject).join(' ')
}

export const getSchemaInfo = (schemaColumnsData: GetSchemaColumnsQuery) => {
  const schemaInfo: SchemaInfo = {}

  const nodes = schemaColumnsData.schemaColumns?.nodes || []

  nodes.forEach((columnAndTable) => {
    const { tableName = '', columnName = '' } = columnAndTable || {}
    if (schemaInfo[tableName]) schemaInfo[tableName].push({ columnName })
    else schemaInfo[tableName] = [{ columnName }]
  })

  return schemaInfo
}

const findColumnInSchema = (
  tableSchemaColumns: SchemaColumn[],
  column: string | undefined | null
) => !!tableSchemaColumns.find(({ columnName }) => camelCase(columnName) === column || '')

export const getTableDisplaysForTableName = (
  tableDisplays: OutcomeDisplayTable[],
  tableSchemaColumns: SchemaColumn[]
) => {
  if (!tableSchemaColumns) return []
  const displayTableRowsWithExistingColumns = tableDisplays.filter((row) =>
    findColumnInSchema(tableSchemaColumns, row?.columnName)
  )

  return displayTableRowsWithExistingColumns.map((displayTable) => ({
    columnName: String(displayTable?.columnName),
    isTextColumn: !!displayTable?.isTextColumn,
    title: String(displayTable?.title),
  }))
}

export const getDetailDisplaysForTableName = (
  tableDetails: OutcomeDisplayDetail[],
  tableSchemaColumns: SchemaColumn[]
) => {
  if (!tableSchemaColumns) return []
  const displayDetailRowsWithExistingColumns = tableDetails.filter((row) =>
    findColumnInSchema(tableSchemaColumns, row?.columnName)
  )

  return displayDetailRowsWithExistingColumns.map((displayDetail) => ({
    columnName: String(displayDetail?.columnName),
    isTextColumn: !!displayDetail?.isTextColumn,
    title: String(displayDetail?.columnName),
    elementTypePluginCode: String(displayDetail?.elementTypePluginCode),
    parameters: displayDetail?.parameters || {},
  }))
}

export const buildTableQuery = (
  { pluralTableName }: OutcomeDisplay,
  tableColumns: TableDisplay[]
) => {
  const query = gql`
      query ${pluralTableName} {
        ${pluralTableName} {
          nodes {
            ${getColumns(tableColumns, ['id'])}
          }
        }
      }
    `

  const getNodes = (queryResult: TableQueryResult) => queryResult?.[pluralTableName]?.nodes || []

  return { query, getNodes }
}

export const buildDetailsQuery = (
  { tableName, detailColumnName }: OutcomeDisplay,
  tableColumns: DetailDisplay[]
) => {
  const query = gql`
      query ${tableName} ($id: Int!) {
        ${tableName} (id: $id ) {
          ${getColumns(tableColumns, [detailColumnName])}
        }
      }
    `

  const getNode = (queryResult: DetailQueryResult) => queryResult?.[tableName] || {}

  return { query, getNode }
}

export const buildCountQuery = ({ pluralTableName }: OutcomeDisplay) => {
  const query = gql`
        query ${pluralTableName}Count {
          ${pluralTableName} (first: 0) {
            totalCount
          }
        }
    `

  const getCount = (queryResult: OutcomeCountQueryResult) =>
    queryResult?.[pluralTableName]?.totalCount || 0

  return { query, getCount }
}

export const getApplicationJoinLinkTableName: GetApplicationJoinLinkTableName = ({
  tableName,
  caseType,
}) => {
  const linkTableName = `${tableName} Application Join`
  if (caseType === CaseType.Camel) return camelCase(linkTableName)
  else return snakeCase(linkTableName)
}

export const getApplicationJoinLinkQueryName = (tableName: string) =>
  `${getApplicationJoinLinkTableName({ tableName, caseType: CaseType.Camel })}s`

export const buildApplicationLinkQuery = ({ tableName }: OutcomeDisplay) => {
  const applicationJoin = getApplicationJoinLinkQueryName(tableName)

  const query = gql`
      query get${tableName}Applications ($id: Int!) {
        ${tableName}(id: $id) {
          ${applicationJoin} {
            nodes {
              application {
                name
                serial
                template {
                  name
                }
              }
            }
          }
        }
      }`

  const getApplications = (queryResult: ApplicationLinkQueryResult) => {
    const applicationJoins = queryResult?.[tableName]?.[applicationJoin]?.nodes || []
    // Remove null joins which is breaking the app
    const cleanApplicationJoins = applicationJoins.filter((join) => !!join)
    if (cleanApplicationJoins.length === 0) return []
    return cleanApplicationJoins.map(({ application }) => ({
      name: String(application.name),
      serial: String(application.serial),
      templateName: String(application?.template?.name),
    }))
  }

  return { query, getApplications }
}
