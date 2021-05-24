import {
  ReviewResponse,
  ReviewResponseDecision,
  ReviewStatus,
  TemplateElementCategory,
} from '../../generated/graphql'
import { FullStructure } from '../../types'

const hasConsolidatorReviewResponse = (reviewerReviewResponse?: ReviewResponse) => {
  const returned =
    (reviewerReviewResponse?.reviewResponsesByReviewResponseLinkId?.nodes || []).length > 0
  console.log(
    reviewerReviewResponse?.reviewResponsesByReviewResponseLinkId,
    reviewerReviewResponse?.reviewResponsesByReviewResponseLinkId.nodes,
    (reviewerReviewResponse?.reviewResponsesByReviewResponseLinkId?.nodes || []).length
  )

  return returned
}

const addChangeRequestForReviewer = (structure: FullStructure) => {
  const questionElements = Object.values(structure?.elementsById || {}).filter(
    ({ element }) => element?.category === TemplateElementCategory.Question
  )

  const hasConsolidatorReviewResponses = questionElements.some(
    ({ thisReviewLatestResponse, thisReviewPreviousResponse }) =>
      hasConsolidatorReviewResponse(thisReviewLatestResponse) ||
      hasConsolidatorReviewResponse(thisReviewPreviousResponse)
  )

  // No consolidation reviews, then don't set isChanged and isChangeRequested fields
  if (!hasConsolidatorReviewResponses) return

  questionElements.forEach((element) => {
    const { thisReviewLatestResponse, thisReviewPreviousResponse } = element
    // For not draft review (in changes requested status), we check the consolidator linked reviewResponse on thisReviewLatestResponse
    if (structure?.thisReview?.status !== ReviewStatus.Draft) {
      const consolidatorLatestReviewResponse =
        thisReviewLatestResponse?.reviewResponsesByReviewResponseLinkId?.nodes[0] // Sorted in useGetReviewResponsesQuery

      element.isChangeRequest =
        consolidatorLatestReviewResponse?.decision === ReviewResponseDecision.Disagree
      element.isChanged = false
      return
    }

    // For draft review we check the consolidator linked reviewResponse on thisReviewPreviousResponse
    // and we should also set isChanged for all question elements
    const consolidatorLatestReviewResponse =
      thisReviewPreviousResponse?.reviewResponsesByReviewResponseLinkId.nodes[0] // Sorted in useGetReviewResponsesQuery
    element.isChangeRequest =
      consolidatorLatestReviewResponse?.decision === ReviewResponseDecision.Disagree
    element.isChanged =
      thisReviewLatestResponse?.comment !== thisReviewPreviousResponse?.comment ||
      thisReviewLatestResponse?.decision !== thisReviewPreviousResponse?.decision
  })
}

export default addChangeRequestForReviewer
