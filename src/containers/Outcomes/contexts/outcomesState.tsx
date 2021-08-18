import { camelCase, snakeCase } from 'lodash'
import React, { useState, useEffect, createContext, useContext } from 'react'
import {
  OutcomeDisplayDetail,
  OutcomeDisplayTable,
  useGetOutcomeDisplaysQuery,
  useGetSchemaColumnsQuery,
} from '../../../utils/generated/graphql'

import {
  OutcomeDisplaysStructure,
  TableDisplaysByCode,
  DetailDisplaysByCode,
  OutcomeDisplays,
  TableDisplaysQueryByCode,
  DetailDisplayQueryByCode,
  ApplicationLinkQueryByCode,
  OutcomeCountQueryByCode,
  SchemaInfo,
} from '../../../utils/types'
import {
  buildTableQuery,
  buildDetailsQuery,
  buildApplicationLinkQuery,
  buildCountQuery,
  getTableDisplaysForTableName,
  getDetailDisplaysForTableName,
  getApplicationJoinLinkTableName,
  getDBApplicationJoinLinkTableName,
  getSchemaInfo,
} from './helpers'

type OutcomesState = {
  error: string
  outcomeDisplaysStructure: OutcomeDisplaysStructure | null
} | null

type ReturnOfOutcomeDisplays = ReturnType<typeof useGetOutcomeDisplaysQuery>

type OutcomeDisplayInnerProps = {
  outcomeDisplaysError: ReturnOfOutcomeDisplays['error']
  outcomeDisplaysData: ReturnOfOutcomeDisplays['data']
}

const DefaultOutcomesState = null
const OutcomesStateContext = createContext<OutcomesState>(DefaultOutcomesState)

const OutcomeDisplayInner: React.FC<OutcomeDisplayInnerProps> = ({
  outcomeDisplaysError,
  outcomeDisplaysData,
  children,
}) => {
  const [state, setState] = useState<OutcomesState>(DefaultOutcomesState)

  const { schemaColumnsError, schemaInfo, schemaTablesAsCamelcase } = useGetSchemaColumns({
    outcomeDisplaysData,
    outcomeDisplaysError,
  })

  useEffect(() => {
    if (outcomeDisplaysError || schemaColumnsError)
      return setState({
        error: outcomeDisplaysError?.message || schemaColumnsError?.message || '',
        outcomeDisplaysStructure: null,
      })

    if (!schemaInfo) return

    const tableDisplaysByCode: TableDisplaysByCode = {}
    const detailDisplaysByCode: DetailDisplaysByCode = {}
    const outcomeDisplays: OutcomeDisplays = []
    const displayNodes = outcomeDisplaysData?.outcomeDisplays?.nodes || []
    const tableDisplayQueryByCode: TableDisplaysQueryByCode = {}
    const detailDisplayQueryByCode: DetailDisplayQueryByCode = {}
    const applicationLinkQueryByCode: ApplicationLinkQueryByCode = {}
    const outcomeCountQueryByCode: OutcomeCountQueryByCode = {}

    displayNodes.forEach((display) => {
      const displayCode = String(display?.code)
      const tableName = String(display?.tableName)
      const outcomeDisplay = {
        code: displayCode,
        detailColumnName: String(display?.detailColumnName),
        pluralTableName: String(display?.pluralTableName),
        tableName,
        title: String(display?.title),
      }
      outcomeDisplays.push(outcomeDisplay)

      const tableSchemaColumns = schemaInfo[tableName]

      tableDisplaysByCode[displayCode] = getTableDisplaysForTableName(
        (display?.outcomeDisplayTables?.nodes || []) as OutcomeDisplayTable[],
        tableSchemaColumns
      )

      detailDisplaysByCode[displayCode] = getDetailDisplaysForTableName(
        (display?.outcomeDisplayDetails?.nodes || []) as OutcomeDisplayDetail[],
        tableSchemaColumns
      )

      tableDisplayQueryByCode[displayCode] = buildTableQuery(
        outcomeDisplay,
        tableDisplaysByCode[displayCode]
      )

      detailDisplayQueryByCode[displayCode] = buildDetailsQuery(
        outcomeDisplay,
        detailDisplaysByCode[displayCode]
      )

      if (schemaTablesAsCamelcase.includes(getApplicationJoinLinkTableName(tableName)))
        applicationLinkQueryByCode[displayCode] = buildApplicationLinkQuery(outcomeDisplay)

      outcomeCountQueryByCode[displayCode] = buildCountQuery(outcomeDisplay)
    })

    setState({
      error: '',
      outcomeDisplaysStructure: {
        outcomeDisplays,
        tableDisplaysByCode,
        detailDisplaysByCode,
        tableDisplayQueryByCode,
        detailDisplayQueryByCode,
        outcomeCountQueryByCode,
        applicationLinkQueryByCode,
      },
    })
  }, [schemaInfo, outcomeDisplaysError, schemaColumnsError])

  return <OutcomesStateContext.Provider value={state}>{children}</OutcomesStateContext.Provider>
}

// Context to get full display helpers
const OutcomeDisplaysContext: React.FC = ({ children }) => {
  const { data, error } = useGetOutcomeDisplaysQuery({ fetchPolicy: 'network-only' })
  // Loading
  if (!data || error!) return null

  return (
    <OutcomeDisplayInner outcomeDisplaysData={data} outcomeDisplaysError={error}>
      {children}
    </OutcomeDisplayInner>
  )
}

const useGetSchemaColumns = ({
  outcomeDisplaysData,
  outcomeDisplaysError,
}: OutcomeDisplayInnerProps) => {
  const [state, setState] = useState<{
    schemaTablesAsCamelcase: string[]
    schemaInfo: SchemaInfo | null
  }>({ schemaTablesAsCamelcase: [], schemaInfo: null })

  const displayNodes = outcomeDisplaysData?.outcomeDisplays?.nodes || []
  const outcomeTables = displayNodes.map((display) => snakeCase(display?.tableName || ''))
  const outcomeApplicationLinkTabeles = displayNodes.map((display) =>
    getDBApplicationJoinLinkTableName(display?.tableName || '')
  )
  const shouldFetchColumns = !outcomeDisplaysError && outcomeTables.length > 1

  const { data, error } = useGetSchemaColumnsQuery({
    variables: { tableNames: [...outcomeTables, ...outcomeApplicationLinkTabeles] },
    fetchPolicy: 'network-only',
    skip: !shouldFetchColumns,
  })
  useEffect(() => {
    if (error || !data) return

    const schemaInfo: SchemaInfo = getSchemaInfo(data)
    const schemaTablesAsCamelcase = Object.keys(schemaInfo).map(camelCase)

    setState({ schemaInfo, schemaTablesAsCamelcase })
  }, [data])

  return {
    schemaColumnsError: error,
    ...state,
  }
}

export const useOutcomeDisplayState = () => useContext(OutcomesStateContext)

export default OutcomeDisplaysContext
