import { useEffect, useState } from 'react'
import {
  Review,
  ReviewAssignment,
  ReviewQuestionAssignment,
  useGetReviewAssignmentQuery,
} from '../generated/graphql'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import { AssignmentDetails } from '../types'
import { getAssignedSections, getAssignedQuestions } from '../helpers/review/getAssignedElements'

interface UseGetReviewAssignmentProps {
  reviewerId: number
  serialNumber: string
}

const useGetReviewAssignment = ({ reviewerId, serialNumber }: UseGetReviewAssignmentProps) => {
  const [assignment, setAssignment] = useState<AssignmentDetails | undefined>()
  const [assignedSections, setAssignedSections] = useState<string[] | undefined>()
  const [assignmentError, setAssignmentError] = useState<string>()

  const {
    error: applicationError,
    loading: applicationLoading,
    application,
    sections,
    isApplicationReady,
  } = useLoadApplication({ serialNumber })

  const { data, loading: apolloLoading, error: apolloError } = useGetReviewAssignmentQuery({
    variables: {
      reviewerId,
      applicationId: application?.id,
      stageId: application?.stage?.id,
    },
    skip: !isApplicationReady,
  })

  useEffect(() => {
    if (data && data.reviewAssignments) {
      const reviewerAssignments = data.reviewAssignments.nodes as ReviewAssignment[]

      // Should have only 1 review assignment per applicaton, stage and reviewer
      if (reviewerAssignments.length === 0) {
        setAssignmentError('No assignments in this review')
        return
      }

      const currentAssignment = reviewerAssignments[0]
      const reviews = currentAssignment.reviews.nodes as Review[]

      // Should have only 1 review per application, stage and reviewer
      const review = reviews.length > 0 ? reviews[0] : undefined

      const reviewQuestions = currentAssignment.reviewQuestionAssignments
        .nodes as ReviewQuestionAssignment[]

      setAssignment({
        id: currentAssignment.id,
        review: review ? { id: review.id, status: review.status as string } : undefined,
        questions: getAssignedQuestions({ reviewQuestions }),
      })
    }
  }, [data])

  useEffect(() => {
    if (assignment && sections) {
      const assignedSections = getAssignedSections({ assignment, sections })
      setAssignedSections(assignedSections)
    }
  }, [assignment])

  return {
    error: apolloError ? (apolloError.message as string) : applicationError || assignmentError,
    loading: applicationLoading || apolloLoading,
    application,
    assignment,
    assignedSections,
  }
}

export default useGetReviewAssignment
