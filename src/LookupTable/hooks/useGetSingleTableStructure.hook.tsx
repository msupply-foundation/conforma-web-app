import { ApolloQueryResult, QueryLazyOptions } from '@apollo/client'
import { useEffect, useState } from 'react'
import { useGetLookupTableStructureByIdLazyQuery } from '../../utils/generated/graphql'
import { LookUpTableType } from '../types'

type LookupTableStructureType = {
  setStructureID: (id: number) => void
  structureLoadState: ApolloQueryResult<any>
  getStructure?: (options?: QueryLazyOptions<any>) => void
  structure?: LookUpTableType
}

const useGetTableStructure = (): LookupTableStructureType => {
  const [structureID, setStructureID] = useState<number>(0)
  const [structure, setStructure] = useState<LookUpTableType>()

  const [execute, structureLoadState]: [
    (options?: any) => void,
    ApolloQueryResult<any>
  ] = useGetLookupTableStructureByIdLazyQuery({
    variables: { lookupTableID: structureID },
    fetchPolicy: 'no-cache',
  })

  const { loading, data, error } = structureLoadState

  useEffect(() => {
    execute({ lookupTableID: Number(structureID) })
  }, [structureID])

  useEffect(() => {
    if (!loading && !error && data?.lookupTable) {
      setStructure(data.lookupTable as any)
    }
  }, [loading, data, error])

  return {
    setStructureID,
    structureLoadState,
    getStructure: execute,
    structure,
  }
}

export default useGetTableStructure
