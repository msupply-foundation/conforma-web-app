import { useState, useEffect } from 'react'
import { useGetOutcomeDisplaysQuery } from '../../../utils/generated/graphql'
import {
  OutcomeDisplaysStructure,
  TableDisplaysByCode,
  DetailDisplaysByCode,
  OutcomeDisplays,
  TableDisplaysQueryByCode,
  DetailDisplayQueryByCode,
  ApplicationLinkQueryByCode,
  OutcomeCountQueryByCode,
} from '../../../utils/types'
import {
  buildTableQuery,
  buildDetailsQuery,
  buildApplicationLinkQuery,
  buildCountQuery,
} from './helpers'

type UseGetOutcomeDisplays = () => {
  error: string
  displays: OutcomeDisplaysStructure | null
}

// Hook used to get outcome displays
const useGetOutcomeDisplays: UseGetOutcomeDisplays = () => {
  const [displays, setDisplays] = useState<OutcomeDisplaysStructure | null>(null)
  const { data, error } = useGetOutcomeDisplaysQuery({ fetchPolicy: 'network-only' })

  useEffect(() => {
    if (!data || !!error) return
    const tableDisplaysByCode: TableDisplaysByCode = {}
    const detailDisplaysByCode: DetailDisplaysByCode = {}
    const outcomeDisplays: OutcomeDisplays = []

    const tableDisplayQueryByCode: TableDisplaysQueryByCode = {}
    const detailDisplayQueryByCode: DetailDisplayQueryByCode = {}
    const applicationLinkQueryByCode: ApplicationLinkQueryByCode = {}
    const outcomeCountQueryByCode: OutcomeCountQueryByCode = {}

    const displayNodes = data?.outcomeDisplays?.nodes || []

    displayNodes.forEach((display) => {
      const displayCode = String(display?.code)
      const outcomeDisplay = {
        code: displayCode,
        detailColumnName: String(display?.detailColumnName),
        pluralTableName: String(display?.pluralTableName),
        tableName: String(display?.tableName),
        title: String(display?.title),
      }
      outcomeDisplays.push(outcomeDisplay)

      tableDisplaysByCode[displayCode] = (display?.outcomeDisplayTables?.nodes || []).map(
        (displayTable) => ({
          columnName: String(displayTable?.columnName),
          isTextColumn: !!displayTable?.isTextColumn,
          title: String(displayTable?.columnName),
        })
      )

      detailDisplaysByCode[displayCode] = (display?.outcomeDisplayDetails?.nodes || []).map(
        (displayDetail) => ({
          columnName: String(displayDetail?.columnName),
          isTextColumn: !!displayDetail?.isTextColumn,
          title: String(displayDetail?.columnName),
          elementTypePluginCode: String(displayDetail?.elementTypePluginCode),
          parameters: displayDetail?.parameters || {},
        })
      )

      tableDisplayQueryByCode[displayCode] = buildTableQuery(
        outcomeDisplay,
        tableDisplaysByCode[displayCode]
      )

      detailDisplayQueryByCode[displayCode] = buildDetailsQuery(
        outcomeDisplay,
        detailDisplaysByCode[displayCode]
      )

      applicationLinkQueryByCode[displayCode] = buildApplicationLinkQuery(outcomeDisplay)

      outcomeCountQueryByCode[displayCode] = buildCountQuery(outcomeDisplay)
    })

    setDisplays({
      outcomeDisplays,
      tableDisplaysByCode,
      detailDisplaysByCode,
      tableDisplayQueryByCode,
      detailDisplayQueryByCode,
      outcomeCountQueryByCode,
      applicationLinkQueryByCode,
    })
  }, [data])

  return {
    error: error?.message || '',
    displays,
  }
}

export default useGetOutcomeDisplays
