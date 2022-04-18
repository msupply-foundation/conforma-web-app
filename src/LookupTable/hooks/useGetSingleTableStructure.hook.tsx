import { ApolloQueryResult, QueryLazyOptions } from '@apollo/client'
import { useEffect, useState } from 'react'
import { useGetLookupTableStructureByIdLazyQuery } from '../../utils/generated/graphql'
import { LookUpTableType } from '../types'
import pluralize from 'pluralize'

type LookupTableStructureType = {
  setStructureID: (id: number) => void
  structureLoadState: ApolloQueryResult<any>
  getStructure?: (options?: QueryLazyOptions<any>) => void
  structure?: LookUpTableType
}

const useGetTableStructure = (): LookupTableStructureType => {
  const [structureID, setStructureID] = useState<number>(0)
  const [structure, setStructure] = useState<LookUpTableType>()

  const [execute, structureLoadState]: [(options?: any) => void, ApolloQueryResult<any>] =
    useGetLookupTableStructureByIdLazyQuery({
      variables: { lookupTableID: structureID },
      fetchPolicy: 'network-only',
    })

  const { loading, data, error }: any = structureLoadState

  useEffect(() => {
    execute({ lookupTableID: Number(structureID) })
  }, [structureID])

  useEffect(() => {
    if (!loading && !error && data?.lookupTable) {
      const lookupTable = data.lookupTable
      const namePlural = pluralize.isPlural(lookupTable.name)
        ? lookupTable.name
        : pluralize.plural(lookupTable.name)
      setStructure({ ...lookupTable, name: namePlural })
    }
  }, [loading, data, error])

  return {
    setStructureID,
    structureLoadState,
    getStructure: (options: any = { lookupTableID: Number(structureID) }) => execute(options),
    structure,
  }
}

export default useGetTableStructure
