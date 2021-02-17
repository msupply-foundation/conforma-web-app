import { ApolloError } from '@apollo/client'
import { useState } from 'react'
import {
  CreateReviewMutation,
  Review,
  useCreateReviewMutation,
} from '../../utils/generated/graphql'
import getReviewAssignmentQuery from '../graphql/queries/getReviewAssignment.query'

export interface CreateReviewProps {
  reviewAssigmentId: number
  applicationResponses: { applicationResponseId: number }[]
}

interface UseCreateReviewProps {
  reviewerId: number
  serialNumber: string
  onCompleted: (id: number) => void
}

const useCreateReview = ({ reviewerId, serialNumber, onCompleted }: UseCreateReviewProps) => {
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
    refetchQueries: [
      {
        query: getReviewAssignmentQuery,
        variables: { reviewerId, serialNumber },
      },
    ],
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
