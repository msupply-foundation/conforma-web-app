import { Decision, ReviewResponseDecision } from '../../generated/graphql'

import { FullStructure, SectionState, Page, PageElement } from '../../types'

const generateReviewProgress = (newStructure: FullStructure) => {
  newStructure?.sortedPages?.forEach(generatePageReviewProgress)
  newStructure?.sortedSections?.forEach(generateSectionReviewProgress)

  generateReviewValidity(newStructure)
}

const generateSectionReviewProgress = (section: SectionState) => {
  section.reviewProgress = getSums(Object.values(section.pages))
}

const conformOriginal = (element: PageElement) =>
  element.latestOriginalReviewResponse?.decision === ReviewResponseDecision.Approve
const nonConformOriginal = (element: PageElement) =>
  element.latestOriginalReviewResponse?.decision === ReviewResponseDecision.Decline
const agreeThisReview = (element: PageElement) =>
  element.thisReviewLatestResponse?.decision === ReviewResponseDecision.Agree
const disagreeThiReview = (element: PageElement) =>
  element.thisReviewLatestResponse?.decision === ReviewResponseDecision.Disagree
const activeThisReview = (element: PageElement) => element.isActiveReviewResponse

const generatePageReviewProgress = (page: Page) => {
  const totalReviewable = page.state.filter(
    (element) => element.isAssigned && element?.element.isVisible
  )

  const totalActive = totalReviewable.filter(activeThisReview)

  // totalConform of originalReviewResponse
  const totalConform = totalReviewable.filter(conformOriginal)
  // totalNonConform of originalReviewResponse
  const totalNonConform = totalReviewable.filter(nonConformOriginal)
  // latestPreviousLevelReviewResponse not linked to thisReviewLatestResponse
  const totalPendingReview = totalReviewable.filter(({ isPendingReview }) => isPendingReview)

  // Linked to latestPreviousLevelReviewResponse
  const totalUpToDateReviewResponses = totalReviewable.filter(
    ({ isPendingReview }) => !isPendingReview
  )

  const totalAgree = totalUpToDateReviewResponses.filter(agreeThisReview)
  const doneDisagree = totalUpToDateReviewResponses.filter(disagreeThiReview)

  const doneAgreeConform = totalAgree.filter(conformOriginal)
  const doneAgreeNonConform = totalAgree.filter(nonConformOriginal)

  const doneActiveDisagree = doneDisagree.filter(activeThisReview)
  const doneActiveAgreeConform = doneAgreeConform.filter(activeThisReview)
  const doneActiveAgreeNonConform = doneAgreeNonConform.filter(activeThisReview)

  page.reviewProgress = {
    totalReviewable: totalReviewable.length,
    totalActive: totalActive.length,
    totalConform: totalConform.length,
    totalNonConform: totalNonConform.length,
    totalPendingReview: totalPendingReview.length,
    doneAgreeConform: doneAgreeConform.length,
    doneAgreeNonConform: doneAgreeNonConform.length,
    doneDisagree: doneDisagree.length,
    doneActiveDisagree: doneActiveDisagree.length,
    doneActiveAgreeConform: doneActiveAgreeConform.length,
    doneActiveAgreeNonConform: doneActiveAgreeNonConform.length,
  }
}

const generateReviewValidity = (newStructure: FullStructure) => {
  const sortedPages = newStructure?.sortedPages || []
  const sums = getSums(sortedPages)

  newStructure.firstIncompleteReviewPage = undefined

  if (sums.doneActiveDisagree > 0) {
    newStructure.canSubmitReviewAs = Decision.ChangesRequested
    return
  }

  if (sums.doneAgreeNonConform > 0) {
    newStructure.canSubmitReviewAs = Decision.NonConform
    return
  }

  if (sums.totalReviewable === sums.doneActiveAgreeConform) {
    newStructure.canSubmitReviewAs = Decision.Conform
    return
  }

  const firstIncomplete = sortedPages.find(
    ({ reviewProgress }) =>
      reviewProgress?.totalReviewable !== (reviewProgress?.doneActiveAgreeConform || 0)
  )

  if (!firstIncomplete) return

  const firstIncompleteReviewPage = {
    sectionCode: firstIncomplete.sectionCode,
    pageNumber: firstIncomplete.number,
  }

  newStructure.firstIncompleteReviewPage = firstIncompleteReviewPage
  newStructure.canSubmitReviewAs === null
}
// Simple helper that will iterate over elements and sum up all of the values for keys
// returning an object of keys with sums
const getSums = (elements: Page[]) => {
  const initial = {
    totalReviewable: 0,
    totalActive: 0,
    totalConform: 0,
    totalNonConform: 0,
    totalPendingReview: 0,
    doneAgreeConform: 0,
    doneAgreeNonConform: 0,
    doneDisagree: 0,
    doneActiveDisagree: 0,
    doneActiveAgreeConform: 0,
    doneActiveAgreeNonConform: 0,
  }

  return elements.reduce(
    (sum, { reviewProgress }) => ({
      totalReviewable: sum.totalReviewable + (reviewProgress?.totalReviewable || 0),
      totalActive: sum.totalActive + (reviewProgress?.totalActive || 0),
      totalConform: sum.totalConform + (reviewProgress?.totalConform || 0),
      totalNonConform: sum.totalNonConform + (reviewProgress?.totalNonConform || 0),
      totalPendingReview: sum.totalPendingReview + (reviewProgress?.totalPendingReview || 0),
      doneAgreeConform: sum.doneAgreeConform + (reviewProgress?.doneAgreeConform || 0),
      doneAgreeNonConform: sum.doneAgreeNonConform + (reviewProgress?.doneAgreeNonConform || 0),
      doneDisagree: sum.doneDisagree + (reviewProgress?.doneDisagree || 0),
      doneActiveDisagree: sum.doneActiveDisagree + (reviewProgress?.doneActiveDisagree || 0),
      doneActiveAgreeConform:
        sum.doneActiveAgreeConform + (reviewProgress?.doneActiveAgreeConform || 0),
      doneActiveAgreeNonConform:
        sum.doneActiveAgreeNonConform + (reviewProgress?.doneActiveAgreeNonConform || 0),
    }),
    initial
  )
}

export default generateReviewProgress
