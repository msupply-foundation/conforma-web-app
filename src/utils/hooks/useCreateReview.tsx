import { ApolloError } from '@apollo/client'
import { useState } from 'react'
import { useCreateReviewMutation } from '../../utils/generated/graphql'
import { AssignmentDetails, FullStructure } from '../types'

interface UseCreateReviewProps {
  structure: FullStructure
  assignment: AssignmentDetails
}

const useCreateReview = ({ assignment }: UseCreateReviewProps) => {
  const [error, setError] = useState<ApolloError | undefined>()

  const [createReviewMutation] = useCreateReviewMutation({
    onError: (error) => setError(error),
  })

  const createReviewFromStructure = async (structure: FullStructure) => {
    const elements = Object.values(structure?.elementsById || {})
    // Exclude not assigned, not visible and missing responses
    const reviewableElements = elements.filter(
      (element) => element?.isAssigned && element?.element.isVisible && element.response?.id
    )

    const applicationResponses = reviewableElements.map((element) => ({
      applicationResponseId: element.response?.id || 0,
      reviewQuestionAssignmentId: element.assignmentId,
    }))
    const result = await createReviewMutation({
      variables: {
        reviewAssigmentId: assignment.id as number,
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
