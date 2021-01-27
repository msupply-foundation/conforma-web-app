import { useEffect, useState } from 'react'
import {
  ApplicationResponse,
  Review,
  ReviewAssignment,
  ReviewQuestionAssignment,
  TemplateElement,
  useGetReviewAssignmentQuery,
} from '../generated/graphql'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import { AssignmentDetails, ReviewQuestion } from '../types'

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
    templateSections,
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

      const questionsAssignments = currentAssignment.reviewQuestionAssignments
        .nodes as ReviewQuestionAssignment[]

      setAssignment({
        id: currentAssignment.id,
        review: review ? { id: review.id, status: review.status as string } : undefined,
        questions: questionsAssignments.reduce(
          (validQuestionAssignments: ReviewQuestion[], questionAssignment) => {
            const { templateElement } = questionAssignment
            const { code, section, applicationResponses } = templateElement as TemplateElement
            const currentResponse =
              applicationResponses.nodes.length > 0
                ? (applicationResponses.nodes[0] as ApplicationResponse)
                : undefined

            // Check if assigned question is valid to include in array
            if (!currentResponse) return validQuestionAssignments

            return [
              ...validQuestionAssignments,
              {
                code,
                responseId: currentResponse.id,
                sectionIndex: section?.index as number,
              },
            ]
          },
          []
        ),
      })
    }
  }, [data])

  useEffect(() => {
    if (assignment && templateSections) {
      const sections = assignment.questions.reduce((sections: string[], { sectionIndex }) => {
        const templateSection = templateSections.find(({ index }) => index === sectionIndex)
        if (templateSection) {
          if (!sections.includes(templateSection.title)) sections.push(templateSection.title)
        }
        return sections
      }, [])
      setAssignedSections(sections)
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
