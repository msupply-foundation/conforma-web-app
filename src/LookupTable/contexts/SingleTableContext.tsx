import { gql, useLazyQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { getDynamicSingleTable } from '../graphql'
import { LookUpTableType } from '../types'
import { capitalizeFirstLetter, toCamelCase } from '../utils'

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

const SingleTableContext = React.createContext({
  setStructure: (structure: any) => structure,
  structure: initialStructureState,
  singleTableLoadState: initialState,
  lookupTable: null,
})

const SingleTableProvider: React.FC = ({ children }) => {
  const GQL_TABLE_NAME_PREFIX = 'lookupTable'

  const [structure, setStructure]: any = useState(initialStructureState)

  const [dynamicQuery, setDynamicQuery] = useState(gql`
    {
      lookupTables {
        nodes {
          id
        }
      }
    }
  `)

  const [getSingleTable, singleTableLoadState] = useLazyQuery(dynamicQuery, {
    fetchPolicy: 'no-cache',
  })

  const { called, loading, data, error } = singleTableLoadState

  const [lookupTable, setLookupTable] = useState(null)

  useEffect(() => {
    if (structure.id) {
      setDynamicQuery(getDynamicSingleTable(structure))
      getSingleTable()
    }
  }, [structure])

  useEffect(() => {
    const tableName = `${GQL_TABLE_NAME_PREFIX}${capitalizeFirstLetter(
      toCamelCase(structure.name)
    )}s`

    if (!loading && called && !error && data[tableName]) {
      setLookupTable(data[tableName].nodes)
    }
  }, [loading, called, data, error])

  return (
    <SingleTableContext.Provider
      value={{ singleTableLoadState, structure, lookupTable, setStructure }}
    >
      {children}
    </SingleTableContext.Provider>
  )
}

const SingleTableConsumer = SingleTableContext.Consumer

export { SingleTableContext, SingleTableProvider, SingleTableConsumer }
