import { Decision, ReviewResponseDecision } from '../../generated/graphql'

import { FullStructure, SectionState, Page, ReviewProgress, PageElement } from '../../types'

const generateReviewerResponsesProgress = (newStructure: FullStructure) => {
  newStructure?.sortedPages?.forEach(setPendingReviews)
  newStructure?.sortedPages?.forEach(generatePageReviewProgress)
  newStructure?.sortedSections?.forEach(generateSectionReviewProgress)

  generateReviewValidity(newStructure)
}

const generateSectionReviewProgress = (section: SectionState) => {
  section.reviewProgress = getReviewProgressSums(Object.values(section.pages))
}

const generatePageReviewProgress = (page: Page) => {
  const totalReviewable = page.state.filter(
    (element) =>
      element.isAssigned && element?.element.isVisible && element?.latestApplicationResponse?.id
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
    doneConform: doneConform.length,
    doneNonConform: doneNonConform.length,
    doneNewReviewable: doneNewReviewable.length,
    totalNewReviewable: totalNewReviewable.length,
    // BaseReviewProgress
    totalReviewable: totalReviewable.length,
    totalActive: totalReviewable.length,
    totalPendingReview: totalPendingReview.length,
  }
}

const setPendingReviews = (page: Page) => {
  const isPendingReview = ({ response, thisReviewLatestResponse }: PageElement) =>
    !!response && response?.id !== thisReviewLatestResponse?.applicationResponseId

  page.state.forEach((element) => {
    element.isPendingReview = isPendingReview(element)
    // console.log(element.element.code, 'isPending', element.isPendingReview)
    // const { response, thisReviewLatestResponse } = element
    // console.log(!!response, response?.id !== thisReviewLatestResponse?.applicationResponseId)
  })
}

const generateReviewValidity = (newStructure: FullStructure) => {
  const sortedPages = newStructure?.sortedPages || []
  const sums = getReviewProgressSums(Object.values(newStructure.sections))

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

/**
 * @function: getReviewProgressSums
 * Helper to iterate over progress and return sums of progress keys
 * @param elements Pages or Sections
 * @returns ReviewProgress of return sum of progresses
 */
const getReviewProgressSums = (elements: (Page | SectionState)[]) => {
  const initial: ReviewProgress = {
    doneConform: 0,
    doneNonConform: 0,
    totalNewReviewable: 0,
    doneNewReviewable: 0,
    // BaseReviewProgress
    totalActive: 0,
    totalReviewable: 0,
    totalPendingReview: 0,
  }

  return elements.reduce((sum, page) => {
    const {
      doneConform,
      doneNonConform,
      totalNewReviewable,
      doneNewReviewable,
      totalActive,
      totalReviewable,
      totalPendingReview,
    } = page.reviewProgress || initial
    return {
      doneConform: sum.doneConform + doneConform,
      doneNonConform: sum.doneNonConform + doneNonConform,
      totalNewReviewable: sum.totalNewReviewable + totalNewReviewable,
      doneNewReviewable: sum.doneNewReviewable + doneNewReviewable,
      // BaseReviewProgress
      totalActive: sum.totalActive + totalActive,
      totalReviewable: sum.totalReviewable + totalReviewable,
      totalPendingReview: sum.totalPendingReview + totalPendingReview,
    }
  }, initial)
}

export default generateReviewerResponsesProgress
