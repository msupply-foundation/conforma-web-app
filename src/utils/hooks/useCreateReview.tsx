import { ApolloError } from '@apollo/client'
import { useState } from 'react'
import { useCreateReviewMutation } from '../../utils/generated/graphql'
import { FullStructure } from '../types'

export interface CreateReviewProps {
  applicationResponses: { applicationResponseId: number; reviewQuestionAssignmentId: number }[]
}

interface UseCreateReviewProps {
  reviewAssigmentId: number
}

const useCreateReview = ({ reviewAssigmentId }: UseCreateReviewProps) => {
  const [error, setError] = useState<ApolloError | undefined>()

  const [createReviewMutation] = useCreateReviewMutation({
    onError: (error) => setError(error),
  })

  const createReviewFromStructure = async (structure: FullStructure) => {
    const elements = Object.values(structure?.elementsById || {})
    const reviewableElements = elements.filter((element) => element?.isAssigned)

    const applicationResponses = reviewableElements.map((element) => ({
      applicationResponseId: element.response?.id || 0,
      reviewQuestionAssignmentId: element.assignmentId,
    }))
    const result = await createReviewMutation({
      variables: {
        reviewAssigmentId,
        applicationResponses,
      },
    })
    if (result.errors) throw new Error(result.errors.toString())
    return result
  }

  return {
    error,
    createReviewFromStructure,
  }
}

export default useCreateReview
