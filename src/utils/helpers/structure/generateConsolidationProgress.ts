import { Decision, ReviewResponseDecision } from '../../generated/graphql'

import { FullStructure, SectionState, Page, PageElement, ConsolidationProgress } from '../../types'
import { getReviewAndConsolidationProgress } from './generateReviewProgress'

const generateConsolidationProgress = (newStructure: FullStructure) => {
  newStructure?.sortedPages?.forEach(generatePageConsolidationProgress)
  newStructure?.sortedSections?.forEach(generateSectionConsolidationProgress)

  generateReviewValidity(newStructure)
}

const generateSectionConsolidationProgress = (section: SectionState) => {
  section.consolidationProgress = getConsolidationProgress(Object.values(section.pages))
  section.reviewAndConsolidationProgress = getReviewAndConsolidationProgress(
    Object.values(section.pages)
  )
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

const generatePageConsolidationProgress = (page: Page) => {
  const totalReviewable = page.state.filter(
    (element) => element.isAssigned && element?.element.isVisible
  )

  const totalActive = totalReviewable.filter(activeThisReview)

  // totalConform of originalReviewResponse
  const totalConform = totalReviewable.filter(conformOriginal)
  // totalNonConform of originalReviewResponse
  const totalNonConform = totalReviewable.filter(nonConformOriginal)
  // lowerLevelReviewLatestResponse not linked to thisReviewLatestResponse
  const totalPendingReview = totalReviewable.filter(({ isPendingReview }) => isPendingReview)

  // Linked to lowerLevelReviewLatestResponse
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

  page.reviewAndConsolidationProgress = {
    totalReviewable: totalReviewable.length,
    totalActive: totalActive.length,
    totalPendingReview: totalPendingReview.length,
  }

  page.consolidationProgress = {
    totalConform: totalConform.length,
    totalNonConform: totalNonConform.length,

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
  const sums = {
    ...getConsolidationProgress(Object.values(newStructure.sections)),
    ...getReviewAndConsolidationProgress(Object.values(newStructure.sections)),
  }

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
    ({ consolidationProgress, reviewAndConsolidationProgress }) =>
      reviewAndConsolidationProgress?.totalReviewable !==
      (consolidationProgress?.doneActiveAgreeConform || 0)
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
const getConsolidationProgress = (elements: (Page | SectionState)[]) => {
  const initial: ConsolidationProgress = {
    totalConform: 0,
    totalNonConform: 0,

    doneAgreeConform: 0,
    doneAgreeNonConform: 0,
    doneDisagree: 0,
    doneActiveDisagree: 0,
    doneActiveAgreeConform: 0,
    doneActiveAgreeNonConform: 0,
  }

  return elements.reduce((sum, page) => {
    const {
      totalConform,
      totalNonConform,
      doneAgreeConform,
      doneAgreeNonConform,
      doneDisagree,
      doneActiveDisagree,
      doneActiveAgreeConform,
      doneActiveAgreeNonConform,
    } = page.consolidationProgress || initial
    return {
      totalConform: sum.totalConform + totalConform,
      totalNonConform: sum.totalNonConform + totalNonConform,
      doneAgreeConform: sum.doneAgreeConform + doneAgreeConform,
      doneAgreeNonConform: sum.doneAgreeNonConform + doneAgreeNonConform,
      doneDisagree: sum.doneDisagree + doneDisagree,
      doneActiveDisagree: sum.doneActiveDisagree + doneActiveDisagree,
      doneActiveAgreeConform: sum.doneActiveAgreeConform + doneActiveAgreeConform,
      doneActiveAgreeNonConform: sum.doneActiveAgreeNonConform + doneActiveAgreeNonConform,
    }
  }, initial)
}

export default generateConsolidationProgress
