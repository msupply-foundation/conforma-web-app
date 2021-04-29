import { gql, useLazyQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { initialStructureState } from '../contexts'
import { getDynamicSingleTable } from '../graphql'
import { capitalizeFirstLetter, toCamelCase } from '../utils'

const useGetSingleTable = () => {
  const GQL_TABLE_NAME_PREFIX = 'lookupTable'

  const [structure, setStructure]: any = useState(initialStructureState)

  const [dynamicQuery, setDynamicQuery] = useState(gql`
    query {
      nodeId
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

  return { singleTableLoadState, structure, lookupTable, setStructure }
}

export default useGetSingleTable
