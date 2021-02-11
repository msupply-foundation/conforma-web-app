import { ReviewResponseDecision, TemplateElementCategory } from '../../generated/graphql'
import { ReviewerResponsesPayload, SectionDetails } from '../../types'

/**
 * @function: validateReview
 * Run the validation on the whole review responses before allow user to
 * submit the review. Checks review responses on pages/sections assigned to
 * the reviewed and checks if review is completed if:
 * - All review responses have Approve decision, or
 * - At least one review response have Decline decision
 * @param userId Current reviewer userId
 * @param reviewSections All reviews responses and elements of application
 */
const validateReview = ({
  userId,
  reviewSections,
}: ReviewerResponsesPayload): SectionDetails | undefined => {
  const invalidSection = Object.values(reviewSections).find((section) => {
    const { assigned, pages } = section
    if (assigned?.id !== userId) return false
    const validPages = Object.entries(pages).filter(([_, { state }]) => {
      // TODO: Create utility function to filter out all INFORMATION elements when checking for status
      const questions = state.filter(
        ({ element }) => element.category === TemplateElementCategory.Question
      )
      return (
        questions.some(({ review }) => review?.decision === ReviewResponseDecision.Decline) ||
        questions.every(({ review }) => review?.decision === ReviewResponseDecision.Approve)
      )
    })
    // If all pages are valid then the section is valid
    if (Object.keys(validPages).length < Object.keys(pages).length) return true
  })
  return invalidSection ? invalidSection.details : undefined
}

export default validateReview
