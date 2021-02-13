import { useEffect, useState } from 'react'
import {
  Review,
  ReviewAssignment,
  ReviewQuestionAssignment,
  ReviewStatus,
  useGetReviewAssignmentQuery,
} from '../generated/graphql'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import { AssignmentDetails, SectionDetails } from '../types'
import { getAssignedSections, getAssignedQuestions } from '../helpers/review/getAssignedElements'

interface UseGetReviewAssignmentProps {
  reviewerId: number
  serialNumber: string
}

const useGetReviewAssignment = ({ reviewerId, serialNumber }: UseGetReviewAssignmentProps) => {
  const [assignment, setAssignment] = useState<AssignmentDetails>()
  const [sectionsAssigned, setSectionsAssigned] = useState<SectionDetails[]>()
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

      // TODO: There might be cases when we have more than one assignemnt to the same reviewer
      // in that case we would be displaying 2 different actions OR considering to add a reviewer
      // level to the URL so we can show separated pages for the Review and consolidation.
      const currentAssignment = reviewerAssignments[0]
      const reviews = currentAssignment.reviews.nodes as Review[]

      // Should have only 1 review per application, stage and reviewer
      const review = reviews.length > 0 ? reviews[0] : undefined

      const reviewQuestions = currentAssignment.reviewQuestionAssignments
        .nodes as ReviewQuestionAssignment[]

      setAssignment({
        id: currentAssignment.id,
        review: review ? { id: review.id, status: review.status as ReviewStatus } : undefined,
        questions: getAssignedQuestions({ reviewQuestions }),
      })
    }
  }, [data])

  useEffect(() => {
    if (assignment && sections) {
      const myAssignedSections = getAssignedSections({ assignment, sections })
      const sectionsAssigned = sections.map((section) => {
        const { title } = section
        return { ...section, assigned: myAssignedSections.includes(title) }
      })
      setSectionsAssigned(sectionsAssigned)
    }
  }, [assignment])

  return {
    error: apolloError ? (apolloError.message as string) : applicationError || assignmentError,
    loading: applicationLoading || apolloLoading,
    application,
    assignment,
    sectionsAssigned,
  }
}

export default useGetReviewAssignment
