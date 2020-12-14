import { useState, useEffect } from 'react'
import { useGetTriggersQuery } from '../../utils/generated/graphql'

type TriggerType = 'applicationTrigger' | 'reviewAssignmentTrigger' | 'reviewTrigger'

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

  console.log('Props', props)

  // Check query is properly formed:
  if (
    (!serialNumber && !reviewAssignmentId && !reviewId) ||
    (triggerType == 'applicationTrigger' && !serialNumber) ||
    (triggerType == 'reviewAssignmentTrigger' && !reviewAssignmentId) ||
    (triggerType == 'reviewTrigger' && !reviewId)
  ) {
    console.log('INVALID QUERY')
    return {
      triggerProcessing: false,
      error: true,
    }
  }

  const queryVariables: TriggerQueryVariables = {
    serial: serialNumber,
    reviewAssignmentId,
    reviewId,
    getApplicationTriggers: triggerType == 'applicationTrigger',
    getReviewAssignmentTriggers: triggerType == 'reviewAssignmentTrigger',
    getReviewTriggers: triggerType == 'reviewTrigger',
  }

  const { data, loading, error } = useGetTriggersQuery({
    variables: queryVariables,
    pollInterval: 500,
    skip: !isProcessing,
    fetchPolicy: 'no-cache',
  })

  useEffect((): any => {
    console.log('SOmething happened')
    if (data) {
      console.log(data)
      let triggerRequested
      switch (triggerType) {
        case 'applicationTrigger':
          triggerRequested = data?.applications?.nodes[0]?.trigger
          break
        case 'reviewAssignmentTrigger':
          triggerRequested = data?.reviewAssignments?.nodes[0]?.trigger
          break
        case 'reviewTrigger':
          triggerRequested = data?.reviews?.nodes[0]?.trigger
          break
        default:
          setIsProcessing(false)
          setTriggerError(true)
      }
      console.log('Trigger:', triggerRequested)
      if (triggerRequested === null) setIsProcessing(false)
    }
    if (error) {
      console.log('WHAT?')
      setIsProcessing(false)
      setTriggerError(true)
    }
  }, [data, loading, error])

  return { triggerProcessing: isProcessing, error: error || triggerError }
}
export default useTriggerProcessing
