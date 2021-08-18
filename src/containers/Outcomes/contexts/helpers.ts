import { gql } from '@apollo/client'
import {
  OutcomeDisplay,
  TableDisplay,
  TableQueryResult,
  DetailDisplay,
  DetailQueryResult,
  OutcomeCountQueryResult,
  ApplicationLinkQueryResult,
} from '../../../utils/types'

export const getColumns = (columns: { columnName: string }[], extraColumns: string[]) => {
  const columnNamesObject: { [columnName: string]: boolean } = { id: true }
  columns.forEach(({ columnName }) => (columnNamesObject[columnName] = true))
  extraColumns.forEach((columnName) => (columnNamesObject[columnName] = true))

  return Object.keys(columnNamesObject).join(' ')
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

export const buildApplicationLinkQuery = ({ tableName }: OutcomeDisplay) => {
  const applicationJoin = `${tableName}ApplicationJoins`

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
    if (applicationJoins.length === 0) return []
    return applicationJoins.map(({ application }) => ({
      name: String(application.name),
      serial: String(application.serial),
      templateName: String(application?.template?.name),
    }))
  }

  return { query, getApplications }
}
