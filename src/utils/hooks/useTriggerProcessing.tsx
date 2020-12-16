import { useState, useEffect } from 'react'
import { useGetTriggersQuery } from '../../utils/generated/graphql'

type TriggerType = 'applicationTrigger' | 'reviewAssignmentTrigger' | 'reviewTrigger'

interface TriggerQueryProps {
  serialNumber?: string
  reviewAssignmentId?: number
  reviewId?: number
  triggerType?: TriggerType
}

const useTriggerProcessing = ({
  serialNumber,
  reviewAssignmentId,
  reviewId,
  triggerType,
}: TriggerQueryProps) => {
  const [isProcessing, setIsProcessing] = useState(true)
  const [triggerError, setTriggerError] = useState(false)

  // Ensure at least one the primary identifiers is provided
  if (!serialNumber && !reviewAssignmentId && !reviewId) {
    console.log('INVALID QUERY')
    setIsProcessing(false)
    setTriggerError(true)
  }

  // If triggerType not provided, infer it from the supplied ID
  const inferredTriggerType = inferTriggerType(triggerType, serialNumber, reviewAssignmentId)

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
    const triggers = data?.applicationTriggerStates?.nodes?.[0]
    if (triggers) {
      let triggerRequested
      switch (inferredTriggerType) {
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

function inferTriggerType(
  triggerType: TriggerType | undefined,
  serial: string | undefined,
  reviewAssignmentId: number | undefined
) {
  return triggerType
    ? triggerType
    : serial
    ? 'applicationTrigger'
    : reviewAssignmentId
    ? 'reviewAssignmentTrigger'
    : 'reviewTrigger'
}
