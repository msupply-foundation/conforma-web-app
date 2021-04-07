import React from 'react'
import { initialStructureState } from '.'
import { useGetSingleTable } from '../hooks'

const initialState: any = {
  data: [],
  loading: true,
  called: false,
  error: {},
}

const SingleTableContext = React.createContext({
  setStructure: (structure: any) => structure,
  structure: initialStructureState,
  singleTableLoadState: initialState,
  lookupTable: null,
})

const SingleTableProvider: React.FC = ({ children }) => {
  const values = useGetSingleTable()

  return <SingleTableContext.Provider value={values}>{children}</SingleTableContext.Provider>
}

const SingleTableConsumer = SingleTableContext.Consumer

export { SingleTableContext, SingleTableProvider, SingleTableConsumer }
