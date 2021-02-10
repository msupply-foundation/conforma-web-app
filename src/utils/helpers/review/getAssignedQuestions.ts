import {
  ApplicationResponse,
  ReviewQuestionAssignment,
  TemplateElement,
} from '../../generated/graphql'
import { ReviewQuestion } from '../../types'
interface GetAssignedQuestionsProps {
  reviewQuestions: ReviewQuestionAssignment[]
}

const getAssignedQuestions = ({ reviewQuestions }: GetAssignedQuestionsProps) => {
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

export default getAssignedQuestions
