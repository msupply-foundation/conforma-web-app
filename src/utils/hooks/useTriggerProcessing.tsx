import { useState, useEffect } from 'react'
import { useGetTriggersQuery } from '../../utils/generated/graphql'

type TriggerType = 'applicationTrigger' | 'reviewAssignmentTrigger' | 'reviewTrigger'

interface TriggerQueryProps {
  checkTrigger: boolean
  serialNumber?: string
  reviewAssignmentId?: number
  reviewId?: number
  triggerType?: TriggerType
}

const useTriggerProcessing = ({
  checkTrigger,
  serialNumber,
  reviewAssignmentId,
  reviewId,
  triggerType,
}: TriggerQueryProps) => {
  const [isProcessing, setIsProcessing] = useState(true)
  const [triggerError, setTriggerError] = useState('')

  // Ensure at least one the primary identifiers is provided
  if (!serialNumber && !reviewAssignmentId && !reviewId) {
    setIsProcessing(false)
    setTriggerError('INVALID QUERY')
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
    skip: !checkTrigger || !isProcessing,
    fetchPolicy: 'no-cache',
  })

  useEffect((): any => {
    const triggers = data?.applicationTriggerStates?.nodes?.[0]

    if (triggers) {
      if (triggers[inferredTriggerType] === null) setIsProcessing(false)
    }
    if (error) {
      setIsProcessing(false)
      setTriggerError(error.message)
    }
  }, [data, loading, error, checkTrigger])

  return { triggerProcessing: isProcessing, error: error || triggerError }
}
export default useTriggerProcessing

function inferTriggerType(
  triggerType: TriggerType | undefined,
  serial: string | undefined,
  reviewAssignmentId: number | undefined
): TriggerType {
  return triggerType
    ? triggerType
    : serial
    ? 'applicationTrigger'
    : reviewAssignmentId
    ? 'reviewAssignmentTrigger'
    : 'reviewTrigger'
}
