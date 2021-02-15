import { useUpdateReviewResponseMutation } from '../generated/graphql'
import getReviewQuery from '../../utils/graphql/queries/getReview.query'
import { useState } from 'react'

interface UseUpdateReviewResponse {
  reviewId: number
  serialNumber: string
}

const useUpdateReviewResponse = ({ reviewId, serialNumber }: UseUpdateReviewResponse) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')

  const [updateReviewResponse] = useUpdateReviewResponseMutation({
    onCompleted: () => setUpdating(false),
    onError: (error) => {
      setError(error.message)
      setUpdating(false)
    },
    refetchQueries: [
      {
        query: getReviewQuery,
        variables: { reviewId: Number(reviewId) },
      },
    ],
  })

  return {
    error,
    updating,
    updateReviewResponse,
  }
}

export default useUpdateReviewResponse
