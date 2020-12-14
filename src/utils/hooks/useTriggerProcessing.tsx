import { isInterfaceType } from 'graphql'
import { useState, useEffect } from 'react'
import { useGetTriggersQuery } from '../../utils/generated/graphql'

type TriggerType = 'applicationTrigger' | 'reviewAssignmentId' | 'reviewTrigger'

interface TriggerQueryVariables {
  serial?: string
  reviewAssignmentId?: number
  reviewId?: number
  getApplicationTriggers: boolean
  getReviewAssignmentTriggers: boolean
  getReviewTriggers: boolean
}

const useTriggerProcessing = (props: {
  serialNumber?: string
  reviewAssignmentId?: number
  reviewId?: number
  triggerType: TriggerType
}) => {
  const { serialNumber, reviewAssignmentId, reviewId, triggerType } = props
  const [isProcessing, setIsProcessing] = useState(true)
  const [triggerError, setTriggerError] = useState(false)

  if (!serialNumber && !reviewAssignmentId && !reviewId)
    return {
      triggerProcessing: false,
      error: true,
    }

  const queryVariables: TriggerQueryVariables = {
    serial: triggerType == 'applicationTrigger' ? serialNumber : undefined,
    reviewAssignmentId: triggerType == 'reviewAssignmentId' ? reviewAssignmentId : undefined,
    reviewId: triggerType == 'reviewTrigger' ? reviewId : undefined,
    getApplicationTriggers: triggerType == 'applicationTrigger',
    getReviewAssignmentTriggers: triggerType == 'reviewAssignmentId',
    getReviewTriggers: triggerType == 'reviewTrigger',
  }

  const { data, loading, error } = useGetTriggersQuery({
    variables: queryVariables,
    pollInterval: 500,
    skip: !isProcessing,
    fetchPolicy: 'no-cache',
  })

  useEffect((): any => {
    if (data?.applicationTriggerStates?.nodes[0]) {
      console.log(data?.applicationTriggerStates?.nodes[0])
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
