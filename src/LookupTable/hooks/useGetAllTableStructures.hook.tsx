import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { getAllTableStructures as getAllTableStructuresGqlQuery } from '../graphql'
import { LookUpTableType } from '../types'

const useGetAllTableStructures = () => {
  const [allTableStructures, setAllTableStructures]: any = useState<null | LookUpTableType[]>(null)

  const [getAllTableStructures, allTableStructuresLoadState] = useLazyQuery(
    getAllTableStructuresGqlQuery,
    {
      fetchPolicy: 'no-cache',
    }
  )

  const { called, loading, data, error } = allTableStructuresLoadState

  useEffect(() => {
    getAllTableStructures()
  }, [])

  useEffect(() => {
    if (!loading && called && !error && data.lookupTables.nodes) {
      setAllTableStructures(
        data.lookupTables.nodes.map((lookupTable: LookUpTableType) => ({
          ...lookupTable,
          isExpanded: false,
        }))
      )
    }
  }, [loading, called, data, error])

  return {
    allTableStructuresLoadState,
    getAllTableStructures,
    allTableStructures,
    setAllTableStructures,
  }
}

export default useGetAllTableStructures
