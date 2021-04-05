import { useLazyQuery } from '@apollo/client'
import React, { useEffect, useReducer, useState } from 'react'
import { useParams } from 'react-router'
import { getTableStructureId } from '../graphql'
import { LookUpTableType } from '../types'

const initialState: any = {
  data: [],
  loading: true,
  error: {},
}

const initialLookupTableState: LookUpTableType = {
  id: 0,
  name: '',
  label: '',
  fieldMap: [],
}

const SingleTableStructureContext = React.createContext({
  state: initialState,
  getSingleTableStructure: () => {},
  lookupTable: initialLookupTableState,
})

const SingleTableStructureProvider: React.FC = ({ children }) => {
  let { lookupTableID } = useParams<{ lookupTableID: string }>()

  const [lookupTable, setLookupTable] = useState<LookUpTableType>(initialLookupTableState)

  const [getSingleTableStructure, state] = useLazyQuery(getTableStructureId, {
    variables: { lookupTableID: Number(lookupTableID) },
    fetchPolicy: 'no-cache',
  })
  const { called, loading, data } = state

  useEffect(() => {
    getSingleTableStructure()
  }, [])

  useEffect(() => {
    if (!loading && called && data.lookupTable) {
      console.log('Single lookup table getting set')
      setLookupTable(data.lookupTable)
    }
  }, [loading, called, data])

  return (
    <SingleTableStructureContext.Provider value={{ state, getSingleTableStructure, lookupTable }}>
      {children}
    </SingleTableStructureContext.Provider>
  )
}

const SingleTableStructureConsumer = SingleTableStructureContext.Consumer

export { SingleTableStructureContext, SingleTableStructureProvider, SingleTableStructureConsumer }
