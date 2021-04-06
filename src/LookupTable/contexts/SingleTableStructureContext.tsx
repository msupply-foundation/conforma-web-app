import { useLazyQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { getTableStructureById } from '../graphql'
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
  const [structureID, setStructureID]: [null | number, any] = useState<number>(0)
  const [structure, setStructure] = useState<LookUpTableType>(initialStructureState)

  const [getStructure, structureLoadState] = useLazyQuery(getTableStructureById, {
    variables: { lookupTableID: structureID },
    fetchPolicy: 'no-cache',
  })

  const { called, loading, data, error } = structureLoadState

  useEffect(() => {
    if (structureID > 0) getStructure({ variables: { lookupTableID: structureID } })
  }, [structureID])

  useEffect(() => {
    if (!loading && called && !error && data.lookupTable) setStructure(data.lookupTable)
  }, [loading, called, data, error])

  return (
    <SingleTableStructureContext.Provider
      value={{ setStructureID, structureLoadState, getStructure, structure }}
    >
      {children}
    </SingleTableStructureContext.Provider>
  )
}

const SingleTableStructureConsumer = SingleTableStructureContext.Consumer

export { SingleTableStructureContext, SingleTableStructureProvider, SingleTableStructureConsumer }
