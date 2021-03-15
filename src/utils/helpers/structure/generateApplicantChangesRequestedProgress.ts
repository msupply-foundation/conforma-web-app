import { FullStructure, SectionStateNEW, PageNEW } from '../../types'

const generateApplicantChangesRequestedProgress = (newStructure: FullStructure) => {
  newStructure?.sortedPages?.forEach(generatePageChangeRequestProgress)
  newStructure?.sortedSections?.forEach(generateSectionReviewProgress)
}

const generateSectionReviewProgress = (section: SectionStateNEW) => {
  section.changeRequestsProgress = getSums(Object.values(section.pages))
}

const generatePageChangeRequestProgress = (page: PageNEW) => {
  const totalChangeRequests = page.state.filter((element) => element.isChangeRequest)
  const doneChangeRequests = totalChangeRequests.filter((element) => element.isChanged)

  page.changeRequestsProgress = {
    totalChangeRequests: totalChangeRequests.length,
    doneChangeRequests: doneChangeRequests.length,
  }
}

// Simple helper that will iterate over elements and sum up all of the values for keys
// returning an object of keys with sums
const getSums = (elements: PageNEW[]) => {
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

export default generateApplicantChangesRequestedProgress
