import { ReviewResponseDecision, TemplateElementCategory } from '../../generated/graphql'
import { SectionDetails, SectionStructure } from '../../types'

interface ValidateReviewProps {
  userId: number
  reviewSections: SectionStructure
}

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
}: ValidateReviewProps): SectionDetails | undefined => {
  const invalidSection = reviewSections?.find((reviewSection) => {
    const { assigned, pages } = reviewSection
    if (assigned?.id !== userId) return false
    const validPages = Object.entries(pages).filter(([pageName, elements]) => {
      // TODO: Create utility function to filter out all INFORMATION elements when checking for status
      const questions = elements.filter(
        (element) => element.element.category === TemplateElementCategory.Question
      )
      return (
        questions.some(({ review }) => review?.decision === ReviewResponseDecision.Decline) ||
        questions.every(({ review }) => review?.decision === ReviewResponseDecision.Approve)
      )
    })
    // If all pages are valid then the section is valid
    if (Object.keys(validPages).length < Object.keys(pages).length) return true
  })
  return invalidSection ? invalidSection.section : undefined
}

export default validateReview
