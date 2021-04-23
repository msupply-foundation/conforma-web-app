import { Decision, ReviewResponseDecision } from '../../generated/graphql'

import { FullStructure, SectionState, Page } from '../../types'

const generateReviewProgress = (newStructure: FullStructure) => {
  newStructure?.sortedPages?.forEach(generatePageReviewProgress)
  newStructure?.sortedSections?.forEach(generateSectionReviewProgress)

  generateReviewValidity(newStructure)
}

const generateSectionReviewProgress = (section: SectionState) => {
  section.reviewProgress = getSums(Object.values(section.pages))
}

const generatePageReviewProgress = (page: Page) => {
  const totalReviewable = page.state.filter(
    (element) => element.isAssigned && element?.element.isVisible
  )

  // Only consider review responses that are linked to latest application response
  const totalReviewableLinkedToLatestApplicationResponse = totalReviewable.filter(
    ({ isPendingReview }) => !isPendingReview
  )

  const doneConform = totalReviewableLinkedToLatestApplicationResponse.filter(
    (element) => element.thisReviewLatestResponse?.decision === ReviewResponseDecision.Approve
  )
  const doneNonConform = totalReviewableLinkedToLatestApplicationResponse.filter(
    (element) => element.thisReviewLatestResponse?.decision === ReviewResponseDecision.Decline
  )
  const totalNewReviewable = totalReviewable.filter((element) => element.isNewApplicationResponse)
  const doneNewReviewable = totalNewReviewable.filter(
    (element) => !element.isPendingReview && element.thisReviewLatestResponse?.decision
  )

  const totalPendingReview = totalReviewable.filter(({ isPendingReview }) => isPendingReview)

  page.reviewProgress = {
    totalReviewable: totalReviewable.length,
    totalActive: totalReviewable.length,
    doneConform: doneConform.length,
    doneNonConform: doneNonConform.length,
    totalNewReviewable: totalNewReviewable.length,
    doneNewReviewable: doneNewReviewable.length,
    totalPendingReview: totalPendingReview.length,
  }
}

const generateReviewValidity = (newStructure: FullStructure) => {
  const sortedPages = newStructure?.sortedPages || []
  const sums = getSums(sortedPages)

  let firstIncompleteReviewPage

  if (sums.doneNonConform === 0 && sums.totalReviewable > sums.doneConform) {
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
    newStructure.canSubmitReviewAs =
      sums.doneNonConform === 0 ? Decision.Conform : Decision.NonConform
}
// Simple helper that will iterate over elements and sum up all of the values for keys
// returning an object of keys with sums
const getSums = (elements: Page[]) => {
  const initial = {
    totalReviewable: 0,
    totalActive: 0,
    doneConform: 0,
    doneNonConform: 0,
    totalNewReviewable: 0,
    doneNewReviewable: 0,
    totalPendingReview: 0,
  }

  return elements.reduce(
    (sum, { reviewProgress }) => ({
      totalReviewable: sum.totalReviewable + (reviewProgress?.totalReviewable || 0),
      totalActive: sum.totalActive + (reviewProgress?.totalActive || 0),
      doneConform: sum.doneConform + (reviewProgress?.doneConform || 0),
      doneNonConform: sum.doneNonConform + (reviewProgress?.doneNonConform || 0),
      totalNewReviewable: sum.totalNewReviewable + (reviewProgress?.totalNewReviewable || 0),
      doneNewReviewable: sum.doneNewReviewable + (reviewProgress?.doneNewReviewable || 0),
      totalPendingReview: sum.totalPendingReview + (reviewProgress?.totalPendingReview || 0),
    }),
    initial
  )
}

export default generateReviewProgress
