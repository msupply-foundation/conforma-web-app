import { ReviewResponseDecision, TemplateElementCategory } from '../../generated/graphql'
import { SectionDetails, SectionStructure } from '../../types'

interface ValidateReviewProps {
  userId: number
  reviewSections: SectionStructure
}

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
