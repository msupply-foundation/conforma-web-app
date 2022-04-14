import { useEffect, useState } from 'react'
import { getRequest } from '../../utils/helpers/fetchMethods'
import config from '../../config'
import { useUserState } from '../../contexts/UserState'
import {
  OutcomesResponse,
  OutcomesTableResponse,
  OutcomesDetailResponse,
  OutcomeTableAPIQueries,
} from '../../utils/types'
const serverURL = config.serverREST

// 3 simple hooks for returning Outcome state

interface OutcomeTableProps {
  tableName: string
  apiQueries: OutcomeTableAPIQueries
}

interface OutcomeDetailsProps {
  tableName: string
  recordId: number
}

export type ErrorResponse = {
  statusCode?: number // from HTTP errors
  error: string | boolean
  message: string
  detail?: string // from GraphQL errors (caught by back-end)
}

export const useOutcomesList = () => {
  // Note: we don't *need* templatePermissions, we only pass it in so that the
  // hook can react to changes, since JWT (what we *actually* need) is not in
  // State (perhaps it should be?)
  const [error, setError] = useState<ErrorResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [outcomesList, setOutcomesList] = useState<OutcomesResponse>([])
  const {
    userState: { templatePermissions },
  } = useUserState()

  useEffect(() => {
    const JWT = localStorage.getItem(config.localStorageJWTKey)
    if (!JWT) return
    const url = `${serverURL}/outcomes`
    processRequest(url, JWT, setError, setLoading, setOutcomesList)
  }, [templatePermissions])

  return { error, loading, outcomesList }
}

export const useOutcomesTable = ({ tableName, apiQueries }: OutcomeTableProps) => {
  const { first, offset, orderBy, ascending } = apiQueries
  const [error, setError] = useState<ErrorResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [outcomeTable, setOutcomeTable] = useState<OutcomesTableResponse>()
  const {
    userState: { templatePermissions },
  } = useUserState()

  useEffect(() => {
    const JWT = localStorage.getItem(config.localStorageJWTKey)
    if (!JWT) return
    const queryElements = []
    if (first) queryElements.push(`first=${first}`)
    if (offset) queryElements.push(`offset=${offset}`)
    if (orderBy) queryElements.push(`orderBy=${orderBy}`)
    if (ascending) queryElements.push(`ascending=${ascending}`)
    const queryString = queryElements.join('&')
    const url = `${serverURL}/outcomes/table/${tableName}?${queryString}`
    processRequest(url, JWT, setError, setLoading, setOutcomeTable)
  }, [templatePermissions, tableName, apiQueries])

  return { error, loading, outcomeTable }
}

export const useOutcomesDetail = ({ tableName, recordId }: OutcomeDetailsProps) => {
  const [error, setError] = useState<ErrorResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [outcomeDetail, setOutcomeDetail] = useState<OutcomesDetailResponse>()
  const {
    userState: { templatePermissions },
  } = useUserState()

  useEffect(() => {
    const JWT = localStorage.getItem(config.localStorageJWTKey)
    if (!JWT) return
    const url = `${serverURL}/outcomes/table/${tableName}/item/${recordId}`
    processRequest(url, JWT, setError, setLoading, setOutcomeDetail)
  }, [templatePermissions, tableName, recordId])

  return { error, loading, outcomeDetail }
}

const processRequest = (
  url: string,
  JWT: string,
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
  getRequest(url, { Authorization: `Bearer ${JWT}` })
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
