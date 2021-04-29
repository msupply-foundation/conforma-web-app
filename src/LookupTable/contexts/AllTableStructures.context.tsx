import React from 'react'
import { useGetAllTableStructures } from '../hooks'

const initialState: any = {
  data: [],
  loading: true,
  called: false,
  error: {},
}

const AllTableStructuresContext = React.createContext({
  allTableStructuresLoadState: initialState,
  allTableStructures: null,
  getAllTableStructures: () => {},
  setAllTableStructures: (rows: any) => rows,
})

const AllTableStructuresProvider: React.FC = ({ children }) => {
  const value = useGetAllTableStructures()
  return (
    <AllTableStructuresContext.Provider value={value}>
      {children}
    </AllTableStructuresContext.Provider>
  )
}

const AllTableStructuresConsumer = AllTableStructuresContext.Consumer

export { AllTableStructuresContext, AllTableStructuresProvider, AllTableStructuresConsumer }
