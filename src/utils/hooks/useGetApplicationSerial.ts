import { useEffect, useState } from 'react'
import { useGetApplicationSerialQuery } from '../generated/graphql'

const MAX_REFETCH = 30
const POLL_INTERVAL = 1000

type UseGetApplicationSerial = () => {
  getSerialAsync: (applicationId: number) => Promise<string>
}

type State = {
  resolve?: (serial: string) => void
  reject?: (error: Error) => void
  applicationId: number
}

const defaultState: State = { applicationId: 0 }

const useGetApplicationSerial: UseGetApplicationSerial = () => {
  const [state, setState] = useState<State>(defaultState)
  const [refetchAttempts, setRefetchAttempts] = useState(0)
  const { applicationId } = state
  const { data, loading, error, refetch } = useGetApplicationSerialQuery({
    variables: {
      id: state.applicationId,
    },
    fetchPolicy: 'network-only',
    skip: !applicationId,
    notifyOnNetworkStatusChange: true,
  })

  useEffect(() => {
    if (error) return processError(error)
    if (loading) return

    if (refetchAttempts > MAX_REFETCH) return processError(new Error('Timed out'))

    if (!data) return processError(new Error('No data'))

    const { trigger = undefined, serial = '' } = data.application || {}

    if (trigger !== null) {
      setRefetchAttempts(refetchAttempts + 1)
      setTimeout(refetch, POLL_INTERVAL)
      return
    }

    if (!serial) return processError(new Error('Serial is empty'))

    processSuccess(serial)
  }, [data, loading, error])

  const processError = (error: Error) => {
    if (state.reject) state.reject(error)
    setState(defaultState)
  }

  const processSuccess = (serial: string) => {
    if (state.resolve) state.resolve(serial)
    setState(defaultState)
  }

  return {
    getSerialAsync: (applicationId) =>
      new Promise((resolve, reject) => setState({ resolve, reject, applicationId })),
  }
}

export default useGetApplicationSerial
