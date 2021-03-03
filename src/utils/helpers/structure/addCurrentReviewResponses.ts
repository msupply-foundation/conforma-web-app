import { ReviewResponse } from '../../generated/graphql'
import { FullStructure } from '../../types'
import addElementsById from './addElementsById'
import getSortedGroupedReviewResponses from './getGroupedReviewResponses'

const addLatestCurrentReviewResponse = ({
  structure,
  sortedReviewResponses,
}: {
  structure: FullStructure
  sortedReviewResponses: ReviewResponse[]
}) => {
  const newStructure = addElementsById(structure)
  const { elementsById } = newStructure

  const groupedReviewResponses = getSortedGroupedReviewResponses(sortedReviewResponses)

  Object.entries(groupedReviewResponses).forEach(([templateElementId, responseGroup]) => {
    const element = elementsById[templateElementId]
    if (!element) return

    element.latestCurrentReviewResponse = responseGroup[0]
    if (responseGroup.length === 1) return

    element.latestPreviousReviewResponse = responseGroup[1]
  })

  return newStructure
}

export default addLatestCurrentReviewResponse
