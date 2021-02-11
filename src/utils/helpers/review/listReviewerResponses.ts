import { TemplateElementCategory } from '../../generated/graphql'
import { ReviewerResponsesPayload, ReviewQuestionDecision } from '../../types'

/**
 * @function listReviewResponses
 * Returns a list with all review responses given by current reviewer
 * for one review, regardeless of the Review status.
 * @param userId Current reviewer userId
 * @param reviewSections All reviews responses and elements of application
 */
const listReviewResponses = ({ userId, reviewSections }: ReviewerResponsesPayload) => {
  const assignedSections = Object.values(reviewSections).filter(
    ({ assigned }) => assigned?.id === userId
  )
  return assignedSections.reduce(
    (reviewerResponseDecisions: ReviewQuestionDecision[], { pages }) => {
      Object.entries(pages).forEach(([pageName, { state }]) => {
        // TODO: Create utility function to filter out all INFORMATION elements when checking for status
        const questions = state.filter(
          ({ element }) => element.category === TemplateElementCategory.Question
        )
        questions.forEach(({ review }) => {
          if (review?.decision) reviewerResponseDecisions.push(review)
        })
      })
      return reviewerResponseDecisions
    },
    []
  )
}

export default listReviewResponses
