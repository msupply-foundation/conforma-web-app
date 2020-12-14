import { ApolloError } from '@apollo/client'
import { useState } from 'react'
import {
  CreateReviewMutation,
  Review,
  useCreateReviewMutation,
} from '../../utils/generated/graphql'

export interface CreateReviewProps {
  reviewAssigmentId: number
  applicationResponses: { applicationResponseId: number }[]
}

interface UseCreateReviewProps {
  onCompleted: (id: number) => void
}

const useCreateReview = ({ onCompleted }: UseCreateReviewProps) => {
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<ApolloError | undefined>()

  const [createReviewMutation] = useCreateReviewMutation({
    onCompleted: ({ createReview }: CreateReviewMutation) => {
      const { id } = createReview?.review as Review
      setProcessing(false)
      onCompleted(id)
    },
    onError: (error) => {
      setProcessing(false)
      setError(error)
    },
  })

  const createReview = ({ reviewAssigmentId, applicationResponses }: CreateReviewProps) => {
    setProcessing(true)
    createReviewMutation({
      variables: {
        reviewAssigmentId,
        applicationResponses,
      },
    })
  }

  return {
    processing,
    error,
    create: createReview,
  }
}

export default useCreateReview
