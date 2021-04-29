import { useLazyQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { initialStructureState } from '../contexts'
import { getTableStructureById } from '../graphql'
import { LookUpTableType } from '../types'

const useGetTableStructure = () => {
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

  return {
    setStructureID,
    structureLoadState,
    getStructure,
    structure,
  }
}

export default useGetTableStructure
