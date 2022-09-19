import { useEffect, useState } from 'react'
import { getRequest, postRequest } from '../helpers/fetchMethods'
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
  dataViewCode: string
  apiQueries: DataViewTableAPIQueries
  filter: object
}

interface DataViewDetailsProps {
  dataViewCode: string
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
    processGetRequest(getServerUrl('dataViews'), setError, setLoading, setDataViewsList)
  }, [templatePermissions])

  return { error, loading, dataViewsList }
}

export const useDataViewsTable = ({ dataViewCode, apiQueries, filter }: DataViewTableProps) => {
  const [error, setError] = useState<ErrorResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [dataViewTable, setDataViewTable] = useState<DataViewsTableResponse>()
  const {
    userState: { templatePermissions },
  } = useUserState()

  useEffect(() => {
    processPostRequest(
      getServerUrl('dataViews', { dataViewCode, query: apiQueries }),
      setError,
      setLoading,
      setDataViewTable,
      filter
    )
  }, [templatePermissions, dataViewCode, apiQueries])

  return { error, loading, dataViewTable }
}

export const useDataViewsDetail = ({ dataViewCode, recordId }: DataViewDetailsProps) => {
  const [error, setError] = useState<ErrorResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [dataViewDetail, setDataViewDetail] = useState<DataViewsDetailResponse>()
  const {
    userState: { templatePermissions },
  } = useUserState()

  useEffect(() => {
    processGetRequest(
      getServerUrl('dataViews', { dataViewCode, itemId: recordId }),
      setError,
      setLoading,
      setDataViewDetail
    )
  }, [templatePermissions, dataViewCode, recordId])

  return { error, loading, dataViewDetail }
}

const processGetRequest = (
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

const processPostRequest = (
  url: string,
  setErrorMethod: (_: ErrorResponse | null) => void,
  setLoadingMethod: (_: boolean) => void,
  setStateMethod: (_: any) => void,
  filter: object
): void => {
  const setState = (errorState: ErrorResponse | null, loadingState: boolean, stateState: any) => {
    setErrorMethod(errorState)
    setLoadingMethod(loadingState)
    setStateMethod(stateState)
  }
  setLoadingMethod(true)
  postRequest({ url, headers: { 'Content-Type': 'application/json' }, jsonBody: filter })
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
