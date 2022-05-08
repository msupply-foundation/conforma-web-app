import { Decision } from '../../generated/graphql'
import { FullStructure } from '../../types'
import { getConsolidationProgress } from './generateConsolidatorResponsesProgress'

const generateConsolidationValidity = (newStructure: FullStructure) => {
  const sortedPages = newStructure?.sortedPages || []
  const { doneActiveDisagree, doneAgreeNonConform, doneActiveAgreeConform, totalActive } =
    getConsolidationProgress(Object.values(newStructure.sections))

  newStructure.firstIncompleteReviewPage = undefined

  if (!newStructure.assignment) return

  if (doneActiveDisagree > 0) {
    newStructure.assignment.canSubmitReviewAs = Decision.ChangesRequested
    return
  }

  if (doneAgreeNonConform > 0) {
    newStructure.assignment.canSubmitReviewAs = Decision.NonConform
    return
  }

  // This used to be totalReviewable instead of totalActive
  // but that breaks Consolidatio to process without agree/disagree to all questions 
  // even the ones that haven't been reviewed or answered by applicant.
  // generateConsolidationValidity & generateConsolidatorResponsesProgress needs better logic.
  if (totalActive === doneActiveAgreeConform) {
    newStructure.assignment.canSubmitReviewAs = Decision.Conform
    return
  }

  const firstIncomplete = sortedPages.find(
    ({ consolidationProgress }) =>
      // consolidationProgress?.totalReviewable !==
      // (consolidationProgress?.doneActiveAgreeConform || 0)
      consolidationProgress?.totalActive !== (consolidationProgress?.doneActiveAgreeConform || 0)
  )

  if (!firstIncomplete) return

  const firstIncompleteReviewPage = {
    sectionCode: firstIncomplete.sectionCode,
    pageNumber: firstIncomplete.number,
  }

  newStructure.firstIncompleteReviewPage = firstIncompleteReviewPage
  newStructure.assignment?.canSubmitReviewAs === null
}

export default generateConsolidationValidity
