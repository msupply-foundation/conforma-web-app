import {
  ApplicationResponse,
  ReviewQuestionAssignment,
  TemplateElement,
} from '../../generated/graphql'
import { AssignmentDetails, ReviewQuestion, SectionDetails } from '../../types'

interface GetAssignedSectionsProps {
  assignment: AssignmentDetails
  sections: SectionDetails[]
}

interface GetAssignedQuestionsProps {
  reviewQuestions: ReviewQuestionAssignment[]
}

export const getAssignedSections = ({
  assignment,
  sections,
}: GetAssignedSectionsProps): Array<string> => {
  const assignedSections = assignment.questions.reduce(
    (assignedSections: Set<string>, { sectionIndex }) => {
      const foundSection = sections.find(({ index }) => index === sectionIndex)
      if (foundSection) assignedSections.add(foundSection.title)
      return assignedSections
    },
    new Set([])
  )

  return Array.from(assignedSections)
}

export const getAssignedQuestions = ({ reviewQuestions }: GetAssignedQuestionsProps) => {
  const assignedQuestions = reviewQuestions.reduce(
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
  )
  return assignedQuestions
}
