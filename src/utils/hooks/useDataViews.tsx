import { useEffect, useState } from 'react'
import { getRequest } from '../helpers/fetchMethods'
import { useUserState } from '../../contexts/UserState'
import getServerUrl from '../helpers/endpoints/endpointUrlBuilder'
import {
  DataViewsResponse,
  DataViewsTableResponse,
  DataViewsDetailResponse,
  DataViewTableAPIQueries,
} from '../types'

// 3 simple hooks for returning Outcome state

interface DataViewTableProps {
  tableName: string
  apiQueries: DataViewTableAPIQueries
}

interface DataViewDetailsProps {
  tableName: string
  recordId: number
}

export type ErrorResponse = {
  statusCode?: number // from HTTP errors
  error: string | boolean
  message: string
  detail?: string // from GraphQL errors (caught by back-end)
}

export const useDataViewsList = () => {
  // Note: we don't *need* templatePermissions, we only use it so that the
  // hook can react to changes, since JWT (what we *actually* need) is not in
  // State (perhaps it should be?)
  const [error, setError] = useState<ErrorResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [dataViewsList, setDataViewsList] = useState<DataViewsResponse>([])
  const {
    userState: { templatePermissions },
  } = useUserState()

  useEffect(() => {
    processRequest(getServerUrl('dataViews', {}), setError, setLoading, setDataViewsList)
  }, [templatePermissions])

  return { error, loading, dataViewsList }
}

export const useDataViewsTable = ({ tableName, apiQueries }: DataViewTableProps) => {
  const [error, setError] = useState<ErrorResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [dataViewTable, setDataViewTable] = useState<DataViewsTableResponse>()
  const {
    userState: { templatePermissions },
  } = useUserState()

  useEffect(() => {
    processRequest(
      getServerUrl('dataViews', { tableName, query: apiQueries }),
      setError,
      setLoading,
      setDataViewTable
    )
  }, [templatePermissions, tableName, apiQueries])

  return { error, loading, dataViewTable }
}

export const useDataViewsDetail = ({ tableName, recordId }: DataViewDetailsProps) => {
  const [error, setError] = useState<ErrorResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [dataViewDetail, setDataViewDetail] = useState<DataViewsDetailResponse>()
  const {
    userState: { templatePermissions },
  } = useUserState()

  useEffect(() => {
    processRequest(
      getServerUrl('dataViews', { tableName, itemId: recordId }),
      setError,
      setLoading,
      setDataViewDetail
    )
  }, [templatePermissions, tableName, recordId])

  return { error, loading, dataViewDetail }
}

const processRequest = (
  url: string,
  setErrorMethod: (_: ErrorResponse | null) => void,
  setLoadingMethod: (_: boolean) => void,
  setStateMethod: (_: any) => void
): void => {
  const setState = (errorState: ErrorResponse | null, loadingState: boolean, stateState: any) => {
    setErrorMethod(errorState)
    setLoadingMethod(loadingState)
    setStateMethod(stateState)
  }
  setLoadingMethod(true)
  getRequest(url)
    .then((response) => {
      if (response?.error) {
        setState(response, false, undefined)
        return
      }
      if (response?.statusCode) {
        setState(response, false, undefined)
        return
      } else setState(null, false, response)
    })
    .catch((error) => {
      setState(error, false, undefined)
    })
}
