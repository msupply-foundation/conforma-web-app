import { useLazyQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { getAllTableStructures } from '../graphql'
import { LookUpTableType } from '../types'

const initialState: any = {
  data: [],
  loading: true,
  called: false,
  error: {},
}

const TableStructuresContext = React.createContext({
  state: initialState,
  LookupTableRows: [],
  getTableStructures: () => {},
  setLookupTableRows: (rows: any) => rows,
})

const TableStructuresProvider: React.FC = ({ children }) => {
  const [getTableStructures, state] = useLazyQuery(getAllTableStructures, {
    fetchPolicy: 'no-cache',
  })

  const { called, loading, data, error } = state

  const [LookupTableRows, setLookupTableRows]: [any, any] = useState<[] | LookUpTableType[]>([])

  useEffect(() => {
    if (!loading && called && !error && data.lookupTables.nodes) {
      setLookupTableRows(
        data.lookupTables.nodes.map((lookupTable: LookUpTableType) => ({
          ...lookupTable,
          isExpanded: false,
        }))
      )
    }
  }, [loading, called, data, error])

  useEffect(() => {
    getTableStructures()
  }, [])

  return (
    <TableStructuresContext.Provider
      value={{ state, getTableStructures, LookupTableRows, setLookupTableRows }}
    >
      {children}
    </TableStructuresContext.Provider>
  )
}

const TableStructuresConsumer = TableStructuresContext.Consumer

export { TableStructuresContext, TableStructuresProvider, TableStructuresConsumer }
