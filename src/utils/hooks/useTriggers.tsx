import { ApolloError } from '@apollo/client'
import { useEffect, useState } from 'react'
import { Trigger } from '../generated/graphql'
import config from '../../config'
import { getRequest } from '../../utils/helpers/fetchMethods'

const MAX_REFETCH = 10
const serverURL = config.serverREST

interface TriggerError {
  type: 'trigger' | 'timeout' | 'network'
  result?: ApolloError | TriggerData[] | undefined
}

type TriggerStatus = 'ready' | 'processing' | 'error'

interface TriggerData {
  table: string
  id: number
  trigger: Trigger
}

interface TriggerState {
  status: TriggerStatus
  errors?: TriggerData[]
}

type Timer = ReturnType<typeof setTimeout>

const useTriggers = (serialNumber: string) => {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<TriggerError | null | undefined>()
  const [refetchAttempts, setRefetchAttempts] = useState(0)
  const [timerId, setTimerId] = useState<Timer>()

  useEffect(() => {
    if (!ready) recheckTriggers()
  }, [])

  useEffect(() => {
    if (refetchAttempts > MAX_REFETCH) {
      setLoading(false)
      setError({ type: 'timeout' })
    } else {
      const timerId = setTimeout(() => {
        getTriggers()
      }, 2000)
      setTimerId(timerId)
    }
  }, [refetchAttempts])

  const getTriggers = async () => {
    console.log('Checking triggers, attempt #', refetchAttempts)
    const result: TriggerState = await getRequest(
      `${serverURL}/check-triggers?serial=${serialNumber}`
    )
    console.log('Result', result.status)
    switch (result.status) {
      case 'error':
        clearTimeout(timerId as Timer)
        setLoading(false)
        setError({ type: 'trigger', result: result.errors })
        break
      case 'processing':
        setRefetchAttempts((prev) => prev + 1)
        break
      case 'ready':
        clearTimeout(timerId as Timer)
        setReady(true)
        setLoading(false)
        break
    }
  }

  const recheckTriggers = async () => {
    setLoading(true)
    setError(null)
    setReady(false)
    setRefetchAttempts(0)
    getTriggers()
  }

  return { ready, loading, error, recheckTriggers }
}

export default useTriggers
