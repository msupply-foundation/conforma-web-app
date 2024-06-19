import { useEffect, useState } from 'react'
import { AllLookupTableStructuresType, LookUpTableType } from '../types'
import { getRequest } from '../../utils/helpers/fetchMethods'
import getServerUrl from '../../utils/helpers/endpoints/endpointUrlBuilder'

export const useGetAllTableStructures = (): AllLookupTableStructuresType => {
  const [allTableStructures, setAllTableStructures] = useState<LookUpTableType[]>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  const refetchAllTableStructures = () => {
    setLoading(true)
    getRequest(getServerUrl('lookupTable', { action: 'list' }))
      .then((result) => {
        setAllTableStructures(result)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    refetchAllTableStructures()
  }, [])

  return {
    allTableStructuresLoadState: { loading, error },
    allTableStructures,
    refetchAllTableStructures,
  }
}

export const useGetSingleTableStructure = (id: number) => {
  const [tableStructure, setTableStructure] = useState<LookUpTableType>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  const refetchTableStructure = () => {
    setLoading(true)
    getRequest(getServerUrl('lookupTable', { action: 'table', id }))
      .then((result) => {
        setTableStructure(result)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    refetchTableStructure()
  }, [])

  return {
    tableStructureLoadingState: { loading, error },
    tableStructure,
    refetchTableStructure,
  }
}
