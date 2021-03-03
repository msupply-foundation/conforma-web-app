import { ReviewResponse } from '../../generated/graphql'
import { FullStructure } from '../../types'
import addElementsById from './addElementsById'
import getSortedGroupedReviewResponses from './getGroupedReviewResponses'

const addLatestOwnedtReviewResponse = ({
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

    element.latestOwnedtReviewResponse = responseGroup[0]
    if (responseGroup.length === 1) return

    element.previousReviewResponse = responseGroup[1]
  })

  return newStructure
}

export default addLatestOwnedtReviewResponse
