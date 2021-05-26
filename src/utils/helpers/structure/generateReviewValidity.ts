import { Decision } from '../../generated/graphql'
import { FullStructure } from '../../types'
import { getChangeRequestsPropress } from './generateReviewerChangesRequestedProgress'
import { getReviewProgress } from './generateReviewerResponsesProgress'

const generateReviewValidity = (newStructure: FullStructure) => {
  const sortedPages = newStructure?.sortedPages || []
  const { doneConform, doneNonConform, totalReviewable } = getReviewProgress(
    Object.values(newStructure.sections)
  )
  const { doneChangeRequests, totalChangeRequests } = getChangeRequestsPropress(
    Object.values(newStructure.sections)
  )

  let firstIncompleteReviewPage

  const incompletedUpdatesToChangesRequest = totalChangeRequests > doneChangeRequests
  const incompletedReviews = doneNonConform === 0 && totalReviewable > doneConform

  if (incompletedUpdatesToChangesRequest || incompletedReviews) {
    const firstIncomplete = sortedPages.find(
      ({ reviewProgress }) =>
        reviewProgress?.totalReviewable !==
        (reviewProgress?.doneConform || 0) + (reviewProgress?.doneNonConform || 0)
    )

    if (!firstIncomplete) return
    else
      firstIncompleteReviewPage = {
        sectionCode: firstIncomplete.sectionCode,
        pageNumber: firstIncomplete.number,
      }
  }

  newStructure.firstIncompleteReviewPage = firstIncompleteReviewPage
  if (firstIncompleteReviewPage) newStructure.canSubmitReviewAs === null
  else
    newStructure.canSubmitReviewAs = doneNonConform === 0 ? Decision.Conform : Decision.NonConform
}

export default generateReviewValidity
