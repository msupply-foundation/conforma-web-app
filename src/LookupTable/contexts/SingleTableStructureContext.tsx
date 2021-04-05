import { useLazyQuery } from '@apollo/client'
import React, { useEffect, useReducer } from 'react'
import { useParams } from 'react-router'
import { getTableStructureId } from '../graphql'

const initialState: any = {
  data: [],
  loading: true,
  error: {},
}

const SingleTableStructureContext = React.createContext({
  state: initialState,
  getSingleTableStructure: () => {},
})

const SingleTableStructureProvider: React.FC = ({ children }) => {
  let { lookupTableID } = useParams<{ lookupTableID: string }>()

  const [getSingleTableStructure, state] = useLazyQuery(getTableStructureId, {
    variables: { lookupTableID: Number(lookupTableID) },
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    getSingleTableStructure()
  }, [])

  return (
    <SingleTableStructureContext.Provider value={{ state, getSingleTableStructure }}>
      {children}
    </SingleTableStructureContext.Provider>
  )
}

const SingleTableStructureConsumer = SingleTableStructureContext.Consumer

export { SingleTableStructureContext, SingleTableStructureProvider, SingleTableStructureConsumer }
