import { ApolloQueryResult, QueryLazyOptions } from '@apollo/client'
import React from 'react'
import { useGetSingleTableStructure } from '../hooks'
import { LookUpTableType } from '../types'

const initialState: any = {
  data: [],
  loading: true,
  called: false,
  error: {},
}

const initialStructureState: LookUpTableType = {
  id: 0,
  name: '',
  label: '',
  fieldMap: [],
}

const SingleTableStructureContext = React.createContext<{
  structureLoadState: ApolloQueryResult<any>
  getStructure?: (options?: QueryLazyOptions<any>) => void
  setStructureID: (id: number) => void
  structure?: LookUpTableType
}>({
  structureLoadState: initialState,
  setStructureID: (id: number) => id,
  structure: initialStructureState,
})

const SingleTableStructureProvider: React.FC = ({ children }) => {
  const values = useGetSingleTableStructure()

  return (
    <SingleTableStructureContext.Provider value={values}>
      {children}
    </SingleTableStructureContext.Provider>
  )
}

const SingleTableStructureConsumer = SingleTableStructureContext.Consumer

export {
  SingleTableStructureContext,
  SingleTableStructureProvider,
  SingleTableStructureConsumer,
  initialStructureState,
}
