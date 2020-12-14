import { useEffect, useState } from 'react'
import { useGetReviewQuery } from '../generated/graphql'

interface UseLoadReviewProps {
  reviewId: number
}

const useLoadReview = ({ reviewId }: UseLoadReviewProps) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { data, error: apolloError, loading: apolloLoading } = useGetReviewQuery({
    variables: {
      reviewId,
    },
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
    loading,
    error,
    data,
  }
}

export default useLoadReview
