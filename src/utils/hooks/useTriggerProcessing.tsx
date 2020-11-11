import { useState, useEffect } from 'react'
import { useGetTriggersQuery } from '../../utils/generated/graphql'

type triggerTypes = 'applicationTrigger' | 'reviewTrigger'

const useTriggerProcessing = (props: { serialNumber: string; trigger: triggerTypes }) => {
  const { serialNumber, trigger } = props
  const [isProcessing, setIsProcessing] = useState(true)

  const { data, loading, error } = useGetTriggersQuery({
    variables: {
      serial: serialNumber,
    },
    pollInterval: 500,
    skip: !isProcessing,
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    if (data && data?.applicationTriggerStates?.nodes[0]) {
      const triggerRequested = data?.applicationTriggerStates?.nodes[0][trigger]
      console.log('Data', data)
      if (triggerRequested === null) setIsProcessing(false)
    }
  }, [data, loading, error])

  return { triggerProcessing: isProcessing, error }
}
export default useTriggerProcessing
