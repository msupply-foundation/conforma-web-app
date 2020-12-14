import { useEffect, useState } from 'react'
import { useGetReviewQuery } from '../generated/graphql'
import useTriggerProcessing from '../../utils/hooks/useTriggerProcessing'

interface UseLoadReviewProps {
  reviewId: number
}

const useLoadReview = ({ reviewId }: UseLoadReviewProps) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { triggerProcessing, error: triggerError } = useTriggerProcessing({
    reviewId,
    // triggerType: 'reviewTrigger',
  })

  const { data, error: apolloError, loading: apolloLoading } = useGetReviewQuery({
    variables: {
      reviewId,
    },
    skip: triggerProcessing,
  })

  useEffect(() => {
    if (apolloError) {
      setError(apolloError.message)
      return
    }
    if (data) {
      setLoading(false)
    }
  }, [apolloError, data])

  return {
    loading: loading || triggerProcessing,
    error: error || triggerError,
    data,
  }
}

export default useLoadReview
