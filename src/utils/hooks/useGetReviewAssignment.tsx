import { useEffect, useState } from 'react'
import {
  Review,
  ReviewAssignment,
  ReviewQuestionAssignment,
  TemplateElement,
  TemplateSectionsOrderBy,
  useGetReviewAssignmentQuery,
} from '../generated/graphql'
import { ApplicationDetails, AssignmentDetails, TemplateSectionPayload } from '../types'

interface UseGetReviewAssignmentProps {
  application: ApplicationDetails | undefined
  templateSections: TemplateSectionPayload[] | undefined
  reviewerId: number
  isApplicationLoaded: boolean
}

const useGetReviewAssignment = ({
  application,
  templateSections,
  reviewerId,
  isApplicationLoaded,
}: UseGetReviewAssignmentProps) => {
  const [assignment, setAssignment] = useState<AssignmentDetails | undefined>()
  const [assignedSections, setAssignedSections] = useState<string[] | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { id: applicationId, stageId } = application ? application : { id: -1, stageId: -1 }

  const { data, loading: apolloLoading, error: apolloError } = useGetReviewAssignmentQuery({
    variables: {
      reviewerId,
      applicationId,
      stageId,
    },
    skip: !isApplicationLoaded,
  })

  useEffect(() => {
    if (apolloError) {
      setError(apolloError.message)
      return
    }

    if (data && data.reviewAssignments) {
      const reviewerAssignments = data.reviewAssignments.nodes as ReviewAssignment[]

      // Should have only 1 review assignment per applicaton, stage and reviewer
      if (reviewerAssignments.length === 0) {
        setError('No assignments in this review')
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
        questions: questionsAssignments.map((questionAssignment) => {
          const { templateElement } = questionAssignment
          const { code, section } = templateElement as TemplateElement
          return {
            code,
            sectionIndex: section?.index as number,
          }
        }),
      })
      setLoading(false)
    }
  }, [data, apolloError])

  useEffect(() => {
    if (assignment && templateSections) {
      const sections = assignment.questions.reduce((sections: string[], { sectionIndex }) => {
        if (sectionIndex) {
          const templateSection = templateSections.find(({ index }) => index === sectionIndex)
          if (templateSection) {
            if (!sections.includes(templateSection.title)) sections.push(templateSection.title)
          }
        }
        return sections
      }, [])
      setAssignedSections(sections)
    }
  }, [assignment])

  return {
    error,
    loading,
    assignment,
    assignedSections,
  }
}

export default useGetReviewAssignment
