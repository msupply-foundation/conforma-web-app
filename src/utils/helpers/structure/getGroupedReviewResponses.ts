import { ReviewResponse } from '../../generated/graphql'
import { GroupedReviewResponses } from '../../types'

const getGroupedReviewResponses = (reviewResponses: ReviewResponse[]): GroupedReviewResponses => {
  const result: GroupedReviewResponses = {}

  reviewResponses.forEach((reviewResponse) => {
    // TODO, use original response link for this
    const responseTemplateElementId = reviewResponse?.applicationResponse?.templateElementId
    if (!responseTemplateElementId) return

    if (!result[responseTemplateElementId]) result[responseTemplateElementId] = []

    result[responseTemplateElementId].push(reviewResponse)
  })

  return result
}

export default getGroupedReviewResponses
