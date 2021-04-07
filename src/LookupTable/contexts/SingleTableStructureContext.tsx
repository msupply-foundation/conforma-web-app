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

const SingleTableStructureContext = React.createContext({
  structureLoadState: initialState,
  getStructure: () => {},
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
