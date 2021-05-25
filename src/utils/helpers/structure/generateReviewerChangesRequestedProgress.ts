import { FullStructure, SectionState, Page, PageElement } from '../../types'

const generateReviewerChangesRequestedProgress = (newStructure: FullStructure) => {
  newStructure?.sortedPages?.forEach(setPendingReviews)
  newStructure?.sortedPages?.forEach(generatePageChangeRequestProgress)
  newStructure?.sortedSections?.forEach(generateSectionReviewProgress)
}

const generateSectionReviewProgress = (section: SectionState) => {
  section.changeRequestsProgress = getSums(Object.values(section.pages))
}

const generatePageChangeRequestProgress = (page: Page) => {
  const totalChangeRequests = page.state.filter(
    ({ isChangeRequest, isAssigned, latestApplicationResponse, element: { isVisible } }) =>
      isChangeRequest && isAssigned && isVisible && latestApplicationResponse?.id
  )

  // Only consider review responses that are linked to latest upper level review responses
  const totalPendingChangeRequests = totalChangeRequests.filter(
    ({ isPendingReview }) => !isPendingReview
  )

  const doneChangeRequests = totalChangeRequests.filter((element) => element.isChanged)

  page.changeRequestsProgress = {
    totalChangeRequests: totalChangeRequests.length,
    doneChangeRequests: doneChangeRequests.length,
  }

  // console.log(page.sectionCode, page.name, page.changeRequestsProgress, totalPendingChangeRequests)
}

const setPendingReviews = (page: Page) => {
  const isPendingReview = ({ isChangeRequest, isChanged }: PageElement) =>
    isChangeRequest && !isChanged

  page.state.forEach((element) => {
    element.isPendingReview = isPendingReview(element)
    //   console.log(element.element.code, 'isPending', element.isPendingReview)
  })
}

// Simple helper that will iterate over elements and sum up all of the values for keys
// returning an object of keys with sums
const getSums = (elements: Page[]) => {
  const initial = {
    totalChangeRequests: 0,
    doneChangeRequests: 0,
  }

  return elements.reduce(
    (sum, { changeRequestsProgress }) => ({
      totalChangeRequests:
        sum.totalChangeRequests + (changeRequestsProgress?.totalChangeRequests || 0),
      doneChangeRequests:
        sum.doneChangeRequests + (changeRequestsProgress?.doneChangeRequests || 0),
    }),
    initial
  )
}

export default generateReviewerChangesRequestedProgress
