import { useLazyQuery } from '@apollo/client'
import React, { useReducer } from 'react'
import { getAllTableStructures } from '../graphql'

const initialState: any = {
  data: [],
  loading: true,
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

  const getMyTableStructures = () => {
    console.log('I am called')
    getTableStructures()
  }

  return (
    <TableStructuresContext.Provider value={{ state, getTableStructures: getMyTableStructures }}>
      {children}
    </TableStructuresContext.Provider>
  )
}

export { TableStructuresContext, TableStructuresProvider }
