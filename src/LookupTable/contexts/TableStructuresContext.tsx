import { useLazyQuery } from '@apollo/client'
import React, { useEffect, useReducer } from 'react'
import { getAllTableStructures } from '../graphql'

const initialState: any = {
  data: [],
  loading: true,
  called: false,
  error: {},
}

const TableStructuresContext = React.createContext({
  state: initialState,
  getTableStructures: () => {},
})

const TableStructuresProvider: React.FC = ({ children }) => {
  const [getTableStructures, state] = useLazyQuery(getAllTableStructures, {
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    getTableStructures()
  }, [])

  return (
    <TableStructuresContext.Provider value={{ state, getTableStructures }}>
      {children}
    </TableStructuresContext.Provider>
  )
}

const TableStructuresConsumer = TableStructuresContext.Consumer

export { TableStructuresContext, TableStructuresProvider, TableStructuresConsumer }
