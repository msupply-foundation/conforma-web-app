import { useState, useEffect } from 'react'
import { useGetTriggersQuery } from '../../utils/generated/graphql'

type TriggerType = 'applicationTrigger' | 'reviewAssignmentTrigger' | 'reviewTrigger'

interface TrigerQueryProps {
  serialNumber?: string
  reviewAssignmentId?: number
  reviewId?: number
  triggerType?: TriggerType
}

const useTriggerProcessing = (props: TrigerQueryProps) => {
  const { serialNumber, reviewAssignmentId, reviewId } = props
  const [isProcessing, setIsProcessing] = useState(true)
  const [triggerError, setTriggerError] = useState(false)

  // Ensure at least one the primary identifiers is provided
  if (!serialNumber && !reviewAssignmentId && !reviewId) {
    console.log('INVALID QUERY')
    setIsProcessing(false)
    setTriggerError(true)
  }

  // If triggerType not provided, infer it from the supplied ID
  const triggerType = props.triggerType
    ? props.triggerType
    : serialNumber
    ? 'applicationTrigger'
    : reviewAssignmentId
    ? 'reviewAssignmentTrigger'
    : 'reviewTrigger'

  const { data, loading, error } = useGetTriggersQuery({
    variables: {
      serial: serialNumber,
      reviewAssignmentId,
      reviewId,
    },
    pollInterval: 500,
    skip: !isProcessing,
    fetchPolicy: 'no-cache',
  })

  useEffect((): any => {
    if (data?.applicationTriggerStates?.nodes[0]) {
      let triggerRequested
      switch (triggerType) {
        case 'applicationTrigger':
          triggerRequested = data?.applicationTriggerStates?.nodes[0]?.applicationTrigger
          break
        case 'reviewAssignmentTrigger':
          triggerRequested = data?.applicationTriggerStates?.nodes[0]?.reviewAssignmentTrigger
          break
        case 'reviewTrigger':
          triggerRequested = data?.applicationTriggerStates?.nodes[0]?.reviewTrigger
          break
        default:
          setIsProcessing(false)
          setTriggerError(true)
      }
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
