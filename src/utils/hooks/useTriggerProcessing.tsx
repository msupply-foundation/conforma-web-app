import { useState, useEffect } from 'react'
import { useGetTriggersQuery } from '../../utils/generated/graphql'

type triggerTypes = 'applicationTrigger' | 'reviewTrigger'

const useTriggerProcessing = (props: { serialNumber: string; trigger: triggerTypes }) => {
  const { serialNumber, trigger } = props
  const [isProcessing, setIsProcessing] = useState(true)
  const [triggerError, setTriggerError] = useState(false)

  const { data, loading, error } = useGetTriggersQuery({
    variables: {
      serial: serialNumber,
    },
    pollInterval: 500,
    skip: !isProcessing,
    fetchPolicy: 'no-cache',
  })

  useEffect((): any => {
    if (data?.applicationTriggerStates?.nodes[0]) {
      const triggerRequested = data?.applicationTriggerStates?.nodes[0][trigger]
      if (triggerRequested === null) setIsProcessing(false)
    }
    if (error) {
      setIsProcessing(false)
      setTriggerError(true)
    }
  }, [data, loading, error])

  return { triggerProcessing: isProcessing, error: error || triggerError }
}
export default useTriggerProcessing
