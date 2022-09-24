import { useEffect, useState } from 'react'
import { getRequest, postRequest } from '../helpers/fetchMethods'
import { useUserState } from '../../contexts/UserState'
import getServerUrl from '../helpers/endpoints/endpointUrlBuilder'
import {
  DataViewsResponse,
  DataViewsTableResponse,
  DataViewsDetailResponse,
  DataViewTableAPIQueries,
  FilterDefinitions,
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
    processRequest({
      url: getServerUrl('dataViews'),
      setError,
      setLoading,
      setStateMethod: setDataViewsList,
    })
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
    processRequest({
      url: getServerUrl('dataViews', { dataViewCode, query: apiQueries }),
      setError,
      setLoading,
      setStateMethod: setDataViewTable,
      filter,
    })
  }, [templatePermissions, dataViewCode, apiQueries])

  return {
    error,
    loading,
    dataViewTable,
    filterDefinitions: buildFilterDefinitions(dataViewTable),
  }
}

export const useDataViewsDetail = ({ dataViewCode, recordId }: DataViewDetailsProps) => {
  const [error, setError] = useState<ErrorResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [dataViewDetail, setDataViewDetail] = useState<DataViewsDetailResponse>()
  const {
    userState: { templatePermissions },
  } = useUserState()

  useEffect(() => {
    processRequest({
      url: getServerUrl('dataViews', { dataViewCode, itemId: recordId }),
      setError,
      setLoading,
      setStateMethod: setDataViewDetail,
    })
  }, [templatePermissions, dataViewCode, recordId])

  return { error, loading, dataViewDetail }
}

interface RequestProps {
  url: string
  setError: (_: ErrorResponse | null) => void
  setLoading: (_: boolean) => void
  setStateMethod: (_: any) => void
  filter?: object
}

const processRequest = ({ url, setError, setLoading, setStateMethod, filter }: RequestProps) => {
  const requestMethod = filter
    ? () => postRequest({ url, headers: { 'Content-Type': 'application/json' }, jsonBody: filter })
    : () => getRequest(url)

  const setState = (errorState: ErrorResponse | null, loadingState: boolean, stateState: any) => {
    setError(errorState)
    setLoading(loadingState)
    setStateMethod(stateState)
  }
  setLoading(true)
  requestMethod()
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

const buildFilterDefinitions = (tableData?: DataViewsTableResponse): FilterDefinitions => {
  if (!tableData) return {}

  const { searchFields, headerRow, tableName, code } = tableData

  const filterDefinitions: FilterDefinitions = {}

  if (searchFields.length > 0)
    filterDefinitions.search = {
      type: 'search',
      default: false,
      visibleTo: [],
      options: {
        orFieldNames: searchFields,
      },
    }

  headerRow.forEach(({ dataType, columnName, title, sortColumn, isBasicField }) => {
    switch (dataType) {
      case 'Date':
        filterDefinitions[columnName] = {
          type: 'date',
          default: false,
          visibleTo: [],
          title,
          options: {},
        }
        break
      case 'string':
        filterDefinitions[columnName] = {
          type: 'searchableListIn',
          default: false,
          visibleTo: [],
          title,
          options: {
            getFilterList: async () => {
              return await getRequest(
                getServerUrl('dataViews', { dataViewCode: code, column: columnName })
              )
            },
          },
        }
        break
    }
  })

  return filterDefinitions
}
