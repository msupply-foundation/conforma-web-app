import { useEffect, useState } from 'react'
import { AllLookupTableStructuresType, LookUpTableType } from '../types'
import { getRequest } from '../../utils/helpers/fetchMethods'
import getServerUrl from '../../utils/helpers/endpoints/endpointUrlBuilder'

const useGetAllTableStructures = (): AllLookupTableStructuresType => {
  const [allTableStructures, setAllTableStructures] = useState<LookUpTableType[]>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [refetch, setRefetch] = useState(true)

  useEffect(() => {
    if (!refetch) return
    setLoading(true)
    getRequest(getServerUrl('lookupTable', { action: 'list' }))
      .then((result) => {
        setAllTableStructures(result)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setRefetch(false)
      })
  }, [refetch])

  return {
    allTableStructuresLoadState: { loading, error },
    allTableStructures,
    refetchAllTableStructures: () => setRefetch(true),
  }
}

export default useGetAllTableStructures
