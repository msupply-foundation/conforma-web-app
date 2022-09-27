import { useEffect, useState, useMemo } from 'react'
import { getRequest, postRequest } from '../helpers/fetchMethods'
import { useUserState } from '../../contexts/UserState'
import getServerUrl from '../helpers/endpoints/endpointUrlBuilder'
import {
  DataViewsResponse,
  DataViewsTableResponse,
  DataViewsDetailResponse,
  DataViewTableAPIQueries,
  FilterDefinitions,
  DataViewFilterType,
  FilterTypes,
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
  const [filterDefinitions, setFilterDefinitions] = useState<any>()
  const {
    userState: { templatePermissions },
  } = useUserState()

  const updateDataViewTable = (dataViewTable: DataViewsTableResponse) => {
    // We only want to load filterDefinitions once, otherwise it gets into an
    // infinite loop. Similarly, we don't want to set the dataViewTable data
    // until we've loaded filterDefinitions, or the Table page will display the
    // full list briefly before showing the filtered list.

    // TO-DO: Additional endpoint to *only* get filter definitions before we
    // fetch the table data

    if (filterDefinitions) setDataViewTable(dataViewTable)
    if (!filterDefinitions) setFilterDefinitions(buildFilterDefinitions(dataViewTable))
  }

  useEffect(() => {
    processRequest({
      url: getServerUrl('dataViews', { dataViewCode, query: apiQueries }),
      setError,
      setLoading,
      setStateMethod: updateDataViewTable,
      filter,
    })
  }, [templatePermissions, dataViewCode, apiQueries])

  return {
    error,
    loading,
    dataViewTable,
    filterDefinitions,
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

  const { searchFields, headerRow, tableName, code, filterDefinitions } = tableData

  const returnFilterDefinitions: FilterDefinitions = {}

  // const filterDefinitions: FilterDefinitions = {}

  if (searchFields.length > 0)
    returnFilterDefinitions.search = {
      type: 'search',
      default: false,
      visibleTo: [],
      options: {
        orFieldNames: searchFields,
      },
    }

  filterDefinitions.forEach(({ column, title, type, searchFields, delimiter, valueMap }) => {
    returnFilterDefinitions[column] = {
      type: filterTypeMap[type],
      default: false,
      visibleTo: [],
      title,
      options: {
        column,
        code,
        searchFields,
        delimiter,
        valueMap,
      },
    }
  })

  return returnFilterDefinitions
}

const filterTypeMap: { [key in DataViewFilterType]: FilterTypes } = {
  TEXT: 'dataViewFreeText',
  LIST: 'dataViewList',
  DATE: 'date',
}
