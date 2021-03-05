import { useEffect, useState } from 'react'
import { AssignmentDetailsNEW } from '../types'
import { Review, ReviewAssignment, ReviewStatus, useGetReviewInfoQuery } from '../generated/graphql'

interface UseGetReviewInfoProps {
  applicationId: number
  userId: number
}

const useGetReviewInfo = ({ applicationId, userId }: UseGetReviewInfoProps) => {
  const [assignments, setAssignments] = useState<AssignmentDetailsNEW[]>()

  const { data, loading, error } = useGetReviewInfoQuery({
    variables: {
      reviewerId: userId,
      applicationId,
    },
  })

  useEffect(() => {
    if (!data) return

    const reviewAssigments = data.reviewAssignments?.nodes as ReviewAssignment[]
    const assignments: AssignmentDetailsNEW[] = reviewAssigments.map((reviewAssignment) => {
      // There will always just be one review assignment linked to a review.
      const review = reviewAssignment.reviews.nodes[0] as Review
      if (reviewAssignment.reviews.nodes.length > 1)
        console.error(
          'More then one review associated with reviewAssignment with id',
          reviewAssignment.id
        )

      const stage = reviewAssignment.stage

      // Extra field just to use in initial example - might conflict with future queries
      // to get reviewQuestionAssignment
      const totalAssignedQuestions = reviewAssignment.reviewQuestionAssignments.totalCount

      const { id, status, timeCreated } = review

      return {
        id: reviewAssignment.id,
        review: review
          ? {
              id,
              status: status as ReviewStatus,
              timeCreated,
              stage: { id: stage?.id as number, name: stage?.title as string },
            }
          : null,
        totalAssignedQuestions,
      }
    })

    setAssignments(assignments)
  }, [data])

  return {
    error: error?.message,
    loading,
    assignments,
  }
}

export default useGetReviewInfo
