import { useEffect, useState } from 'react'
import { getRequest } from '../../utils/helpers/fetchMethods'
import config from '../../config'
import { LOCAL_STORAGE_JWT_KEY } from '../data/globalConstants'
import { TemplatePermissions } from '../types'
import {
  OutcomesResponse,
  OutcomesTableResponse,
  OutcomesDetailResponse,
  OutcomeTableAPIQueries,
} from '../../containers/Outcomes/types'
const serverURL = config.serverREST

// 3 simple hooks for returning Outcome state

interface OutcomeListProps {
  templatePermissions?: TemplatePermissions
}

interface OutcomeTableProps extends OutcomeListProps {
  tableName: string
  apiQueries: OutcomeTableAPIQueries
}

interface OutcomeDetailsProps extends OutcomeListProps {
  tableName: string
  recordId: number
}

type ErrorResponse = {
  statusCode: number
  error: string
  message: string
}

export const useOutcomesList = ({ templatePermissions }: OutcomeListProps) => {
  // Note: we don't *need* templatePermissions, we only pass it in so that the
  // hook can react to changes, since JWT (what we *actually* need) is not in
  // State (perhaps it should be?)
  const [error, setError] = useState<ErrorResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [outcomesList, setOutcomesList] = useState<OutcomesResponse>([])

  useEffect(() => {
    const JWT = localStorage.getItem(LOCAL_STORAGE_JWT_KEY)
    if (!JWT) return
    const url = `${serverURL}/outcomes`
    processRequest(url, JWT, setError, setLoading, setOutcomesList)
  }, [templatePermissions])

  return { error, loading, outcomesList }
}

export const useOutcomesTable = ({
  templatePermissions,
  tableName,
  apiQueries,
}: OutcomeTableProps) => {
  const { first, offset, orderBy, ascending } = apiQueries
  const [error, setError] = useState<ErrorResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [outcomeTable, setOutcomeTable] = useState<OutcomesTableResponse>()

  useEffect(() => {
    const JWT = localStorage.getItem(LOCAL_STORAGE_JWT_KEY)
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

export const useOutcomesDetail = ({
  templatePermissions,
  tableName,
  recordId,
}: OutcomeDetailsProps) => {
  const [error, setError] = useState<ErrorResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [outcomeDetail, setOutcomeDetail] = useState<OutcomesDetailResponse>()

  useEffect(() => {
    const JWT = localStorage.getItem(LOCAL_STORAGE_JWT_KEY)
    if (!JWT) return
    const url = `${serverURL}/outcomes/table/${tableName}/item/${recordId}`
    processRequest(url, JWT, setError, setLoading, setOutcomeDetail)
  }, [templatePermissions])

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
      if (response?.statusCode) {
        setState(response, false, undefined)
        return
      } else setState(null, false, response)
    })
    .catch((error) => {
      setState(error, false, undefined)
    })
}
