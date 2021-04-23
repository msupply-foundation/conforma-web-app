import { cloneDeep } from '@apollo/client/utilities'
import {
  GetReviewResponsesQuery,
  ReviewResponse,
  ReviewQuestionAssignment,
  TemplateElement,
  ReviewStatus,
} from '../../generated/graphql'
import {
  addElementsById,
  addSortedSectionsAndPages,
  generateReviewProgress,
  generateReviewSectionActions,
} from '../../helpers/structure'
import addReviewResponses from '../../helpers/structure/addReviewResponses'
import generateReviewConsolidationProgress from '../../helpers/structure/generateReviewConsolidationProgress'

import {
  UseGetReviewStructureForSectionProps,
  User,
  FullStructure,
  SectionState,
  PageElement,
} from '../../types'

const getSectionIds = ({
  fullApplicationStructure,
  filteredSectionIds,
}: UseGetReviewStructureForSectionProps) =>
  filteredSectionIds ||
  Object.values(fullApplicationStructure.sections).map((section) => section.details.id) ||
  []

interface CompileVariablesForReviewResponseQueryProps extends UseGetReviewStructureForSectionProps {
  currentUser?: User | null
  sectionIds: number[]
}

type GenerateReviewStructure = (
  props: CompileVariablesForReviewResponseQueryProps & { data: GetReviewResponsesQuery }
) => FullStructure

// Since useGetReviewResponseQuery is used in both useGetReviewStructureForSection and useGetReviewStructureForSectionAsync, this helper aids in computing variables for the query
const compileVariablesForReviewResponseQuery = ({
  reviewAssignment,
  sectionIds,
  fullApplicationStructure,
  currentUser,
}: CompileVariablesForReviewResponseQueryProps) => ({
  reviewAssignmentId: reviewAssignment.id as number,
  sectionIds,
  userId: currentUser?.userId as number,
  previousLevel: reviewAssignment.level - 1,
  stageNumber: reviewAssignment.stage.number,
  applicationId: fullApplicationStructure.info.id,
})

const generateReviewStructure: GenerateReviewStructure = ({
  data,
  fullApplicationStructure,
  reviewAssignment,
  currentUser,
  sectionIds,
}) => {
  // requires deep clone one we have concurrent useGetFullReviewStructure that could possibly
  // mutate fullApplicationStructure
  let newStructure: FullStructure = cloneDeep(fullApplicationStructure)

  const { reviewQuestionAssignments, level, review } = reviewAssignment

  // This is usefull for linking assignments to elements
  newStructure = addElementsById(newStructure)
  newStructure = addSortedSectionsAndPages(newStructure)

  newStructure = addIsAssigned(newStructure, reviewQuestionAssignments)

  // here we add responses from other review (not from this review assignmnet)

  setIsNewApplicationResponse(newStructure)

  // thisReviewLatestResponse and thisReviewPreviousResponse
  // latestPreviousLevelReviewResponse and previousPreviousReviewLevelResponse
  // latestOriginalReviewResponse and previousOriginalReviewResponse
  newStructure = addAllReviewResponses(newStructure, data)

  // review info comes from reviewAssignment that's passed to this hook
  newStructure.thisReview = review

  newStructure = addIsPendingReview(newStructure, level)
  newStructure = addIsActiveReviewResponse(newStructure, level)

  if (level === 1) {
    generateReviewProgress(newStructure)
  } else {
    generateReviewConsolidationProgress(newStructure)
  }

  // filter by supplied sections or by all sections if none supplied to the hook
  const sections = getFilteredSections(sectionIds, newStructure.sortedSections || [])
  generateReviewSectionActions({
    sections,
    reviewAssignment,
    thisReview: newStructure.thisReview,
    currentUserId: currentUser?.userId as number,
  })

  // generateConsolidationProgress
  return newStructure
}

const setIsNewApplicationResponse = (structure: FullStructure) => {
  Object.values(structure.elementsById || {}).forEach((element) => {
    element.isNewApplicationResponse =
      element?.latestApplicationResponse?.timeUpdated === structure.info.current?.date &&
      !!element?.previousApplicationResponse
  })
}

const getFilteredSections = (sectionIds: number[], sections: SectionState[]) => {
  return sections.filter((section) =>
    sectionIds.find((sectionId) => section.details.id === sectionId)
  )
}

const addIsPendingReview = (structure: FullStructure, reviewLevel: number) => {
  const isPendingReview =
    reviewLevel === 1
      ? (element: PageElement) =>
          element.response?.id !== element.thisReviewLatestResponse?.applicationResponseId
      : (element: PageElement) =>
          element?.latestPreviousLevelReviewResponse?.id !==
          element.thisReviewLatestResponse?.reviewResponseLinkId

  Object.values(structure.elementsById || {}).forEach((element) => {
    element.isPendingReview = isPendingReview(element)
  })
  return structure
}
// When consolidation is ongoing for one review, and change request was submitted for the other one, the only 'active' or 'editable' review response is the one not in change request (submitted)
const addIsActiveReviewResponse = (structure: FullStructure, reviewLevel: number) => {
  Object.values(structure.elementsById || {}).forEach((element) => {
    if (reviewLevel === 1) {
      element.isActiveReviewResponse = true
      return
    }
    element.isActiveReviewResponse =
      !element.isPendingReview &&
      element?.latestPreviousLevelReviewResponse?.review?.status === ReviewStatus.Submitted
  })
  return structure
}

const addAllReviewResponses = (structure: FullStructure, data: GetReviewResponsesQuery) => {
  // add thisReviewLatestResponse and thisReviewPreviousResponse
  structure = addReviewResponses(
    structure,
    data?.thisReviewResponses?.nodes as ReviewResponse[], // Sorted in useGetReviewResponsesQuery
    (element, response) => (element.thisReviewLatestResponse = response),
    (element, response) => (element.thisReviewPreviousResponse = response)
  )
  // add latestPreviousLevelReviewResponse and previousPreviousReviewLevelResponse
  structure = addReviewResponses(
    structure,
    data?.previousLevelReviewResponses?.nodes as ReviewResponse[], // Sorted in useGetReviewResponsesQuery
    (element, response) => (element.latestPreviousLevelReviewResponse = response),
    (element, response) => (element.previousPreviousLevelReviewResponse = response)
  )
  // add latestOriginalReviewResponse and previousOriginalReviewResponse
  structure = addReviewResponses(
    structure,
    data?.previousLevelReviewResponses?.nodes as ReviewResponse[], // Sorted in useGetReviewResponsesQuery
    (element, response) => (element.latestOriginalReviewResponse = response),
    (element, response) => (element.previousOriginalReviewResponse = response)
  )

  return structure
}

const addIsAssigned = (
  newStructure: FullStructure,
  reviewQuestionAssignment: ReviewQuestionAssignment[]
) => {
  reviewQuestionAssignment.forEach(({ templateElement, id }) => {
    const { id: templateElementId } = templateElement as TemplateElement
    const assignedElement = newStructure?.elementsById?.[templateElementId || '']

    if (!assignedElement) return

    assignedElement.isAssigned = true
    assignedElement.assignmentId = id
  })
  return newStructure
}

export { generateReviewStructure, getSectionIds, compileVariablesForReviewResponseQuery }
