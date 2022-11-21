import { cloneDeep } from '@apollo/client/utilities'
import {
  GetReviewResponsesQuery,
  ReviewResponse,
  ReviewResponseStatus,
  ReviewStatus,
  ReviewAssignmentStatus,
} from '../../generated/graphql'
import {
  addChangeRequestForReviewer,
  addElementsById,
  addReviewResponses,
  updateSectionsAndPages,
  generateConsolidationValidity,
  generateConsolidatorResponsesProgress,
  generateFinalDecisionProgress,
  generateReviewerChangesRequestedProgress,
  generateReviewerResponsesProgress,
  generateReviewSectionActions,
  generateReviewValidity,
} from '../../helpers/structure'

import {
  UseGetReviewStructureForSectionProps,
  User,
  FullStructure,
  SectionState,
  PageElement,
  AssignmentDetails,
  ReviewAssignment,
  ElementsById,
} from '../../types'

const getSectionIds = ({
  reviewStructure,
  filteredSectionIds,
}: UseGetReviewStructureForSectionProps) =>
  filteredSectionIds ||
  Object.values(reviewStructure.sections)
    .filter(({ details }) => details.active)
    .map((section) => section.details.id) ||
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
  reviewStructure,
  currentUser,
}: CompileVariablesForReviewResponseQueryProps) =>
  reviewAssignment
    ? {
        applicationId: reviewStructure.info.id,
        reviewAssignmentId: reviewAssignment.id as number,
        sectionIds,
        userId: currentUser?.userId as number,
        previousLevel: reviewAssignment.level - 1,
        stageNumber: reviewAssignment.current.stage.number,
        previousStage: reviewAssignment.current.stage.number - 1,
        shouldIncludePreviousStage: !!reviewAssignment.isMakeDecision,
      }
    : undefined

const generateReviewStructure: GenerateReviewStructure = ({
  data,
  reviewAssignment,
  reviewStructure,
  currentUser,
  sectionIds,
}) => {
  // requires deep clone one we have concurrent useGetFullReviewStructure that could possibly
  // mutate fullApplicationStructure
  let newStructure: FullStructure = cloneDeep(reviewStructure)

  if (!reviewAssignment) return newStructure

  const { level } = reviewAssignment

  // This is useful for linking assignments to elements
  newStructure = addElementsById(newStructure)
  newStructure = updateSectionsAndPages(newStructure)

  newStructure = addIsAssigned(newStructure, reviewAssignment)

  // Update fields element.isNewApplicantRsponse for applications re-submitted to a reviewer
  setIsNewApplicationResponse(newStructure)

  // thisReviewLatestResponse and thisReviewPreviousResponse
  // lowerLevelReviewLatestResponse and previousPreviousReviewLevelResponse
  // latestOriginalReviewResponse and previousOriginalReviewResponse
  newStructure = addAllReviewResponses(newStructure, data)

  setReviewAndAssignment(newStructure, reviewAssignment)

  // Update fields element.isNewReviewResponse for reviews re-submitted to a consolidator
  setIsNewReviewResponse(newStructure)

  // when changes requested by consolidator (included in thisReviewPreviousResponse OR thisReviewLatestResponse)
  addChangeRequestForReviewer(newStructure)

  newStructure = addIsPendingReview(newStructure, level)
  newStructure = addIsActiveReviewResponse(newStructure)

  // This needs to run before generateReveiwerProgress or generateConsolidatorProgress
  // since the reviews with isChangeRequest (and not changed) need to be removed from done accountings
  generateReviewerChangesRequestedProgress(newStructure)

  if (newStructure.assignment?.isMakeDecision) generateFinalDecisionProgress(newStructure)
  else if (level === 1) {
    generateReviewerResponsesProgress(newStructure)
    generateReviewValidity(newStructure)
  } else {
    // This progress is NOT removing done from changes requested not changed yet!
    generateConsolidatorResponsesProgress(newStructure)
    generateConsolidationValidity(newStructure)
  }

  // filter by supplied sections or by all sections if none supplied to the hook
  const sections = getFilteredSections(sectionIds, newStructure.sortedSections || [])
  generateReviewSectionActions({
    sections,
    thisReview: newStructure.thisReview,
    reviewAssignment: newStructure.assignment as ReviewAssignment,
    currentUserId: currentUser?.userId as number,
  })

  // generateConsolidationProgress
  return newStructure
}

const setIsNewApplicationResponse = (structure: FullStructure) => {
  Object.values(structure.elementsById || {}).forEach((element) => {
    element.isNewApplicationResponse =
      element?.latestApplicationResponse?.timeUpdated === structure.info.current.timeStageCreated &&
      !!element?.previousApplicationResponse
  })
}

const setReviewAndAssignment = (structure: FullStructure, reviewAssignment: AssignmentDetails) => {
  const {
    isLastLevel,
    isMakeDecision,
    isSelfAssignable,
    review,
    level,
    current: { stage },
  } = reviewAssignment

  const isPreviousStageConsolidation = Object.values(structure.elementsById || {}).some(
    ({ lowerLevelReviewLatestResponse }) => !!lowerLevelReviewLatestResponse
  )

  // review info comes from reviewAssignment that's passed to this hook
  structure.thisReview = review || undefined
  structure.assignment = {
    assignmentId: reviewAssignment.id,
    assignee: reviewAssignment.reviewer,
    assigneeLevel: level,
    assigneeStage: stage.number,
    assignmentStatus: reviewAssignment.current.assignmentStatus as ReviewAssignmentStatus,
    assignmentDate: reviewAssignment.current.timeStatusUpdated,
    assignedSections: reviewAssignment.assignedSections,
    isLastLevel,
    isSelfAssignable,
    isMakeDecision,
    isMakeDecisionOnConsolidation: isPreviousStageConsolidation,
    canSubmitReviewAs: null,
  }
}

const setIsNewReviewResponse = (structure: FullStructure) => {
  Object.values(structure.elementsById || {}).forEach((element) => {
    const {
      isAssigned,
      lowerLevelReviewLatestResponse,
      thisReviewPreviousResponse,
      thisReviewLatestResponse,
    } = element

    // Just update field in assigned elements
    if (isAssigned) {
      if (structure.thisReview?.current?.reviewStatus === ReviewStatus.Draft) {
        element.isNewReviewResponse =
          !!thisReviewPreviousResponse &&
          lowerLevelReviewLatestResponse?.timeUpdated > thisReviewPreviousResponse?.timeUpdated
      } else {
        element.isNewReviewResponse =
          lowerLevelReviewLatestResponse?.timeUpdated > thisReviewLatestResponse?.timeUpdated
      }
    }
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
          !!element.response &&
          element.response?.id !== element?.thisReviewLatestResponse?.applicationResponseId
      : (element: PageElement) =>
          !!element?.lowerLevelReviewLatestResponse &&
          element.lowerLevelReviewLatestResponse?.id !==
            element?.thisReviewLatestResponse?.reviewResponseLinkId

  Object.values(structure.elementsById || {}).forEach((element) => {
    element.isPendingReview = isPendingReview(element)
  })
  return structure
}
// When consolidation is ongoing for one review, and change request was submitted for the other one, the only 'active' or 'editable' review response is the one not in change request (submitted)
const addIsActiveReviewResponse = (structure: FullStructure) => {
  Object.values(structure.elementsById || {}).forEach((element) => {
    element.isActiveReviewResponse =
      element?.thisReviewLatestResponse?.status === ReviewResponseStatus.Draft
  })
  return structure
}

const addAllReviewResponses = (structure: FullStructure, data: GetReviewResponsesQuery) => {
  // Following arrays have been sorted in useGetReviewResponsesQuery
  const thisReviewResponses = (data?.thisReviewResponses?.nodes || []) as ReviewResponse[]
  const lowerLevelReviewResponses = (data?.previousLevelReviewResponses?.nodes ||
    []) as ReviewResponse[]
  const originalReviewResponses = (data?.originalReviewResponses?.nodes || []) as ReviewResponse[]
  const previousOriginalReviewResponses = (data?.previousOriginalReviewResponses?.nodes ||
    []) as ReviewResponse[]

  const isMakeDecision = !!structure.assignment?.isMakeDecision

  // add thisReviewLatestResponse and thisReviewPreviousResponse
  // includes for a consolidation also has reviewResponsesByReviewResponseLinkId with Consolidator decision
  structure = addReviewResponses(
    structure,
    thisReviewResponses,
    (element, response) => (element.thisReviewLatestResponse = response),
    (element, response) => (element.thisReviewPreviousResponse = response)
  )

  // add lowerLevelReviewLatestResponse and previousPreviousReviewLevelResponse
  structure = addReviewResponses(
    structure,
    lowerLevelReviewResponses,
    (element, response) => (element.lowerLevelReviewLatestResponse = response),
    (element, response) => (element.lowerLevelReviewPreviousResponse = response)
  )

  // add latestOriginalReviewResponse and previousOriginalReviewResponse
  // or previousStage originalResponses - when it s make decision (and original is in previous stage)
  structure = addReviewResponses(
    structure,
    isMakeDecision ? previousOriginalReviewResponses : originalReviewResponses,
    (element, response) => (element.latestOriginalReviewResponse = response),
    (element, response) => (element.previousOriginalReviewResponse = response)
  )

  const isUpdatedDecision = (
    latestReviewResponse?: ReviewResponse,
    previousReviewResponse?: ReviewResponse
  ) => {
    if (!latestReviewResponse || !previousReviewResponse) return false
    const { decision: latestDecision, comment: lastestComment } = latestReviewResponse
    const { decision: previousDecision, comment: previousComment } = previousReviewResponse
    return latestDecision !== previousDecision || lastestComment !== previousComment
  }

  Object.entries(structure?.elementsById || {}).forEach(([id, element]) => {
    const elementThisReviewResponses = thisReviewResponses.filter(
      ({ templateElementId }) => templateElementId && String(templateElementId) === id
    )
    const elementLowerLevelReviewResponses = lowerLevelReviewResponses.filter(
      ({ templateElementId }) => templateElementId && String(templateElementId) === id
    )

    const hasThisReviewResponsesHistory =
      elementThisReviewResponses.length > 2 ||
      isUpdatedDecision(element.thisReviewLatestResponse, element.thisReviewPreviousResponse)

    const hasLowerLevelReviewResponsesHistory =
      elementLowerLevelReviewResponses.length > 2 ||
      isUpdatedDecision(
        element.lowerLevelReviewLatestResponse,
        element.lowerLevelReviewPreviousResponse
      )

    // Will enable the viewHistory option for elements if is Make Decision review or if
    // enableViewHistory already set to true (when there is more than 2 ApplicantResponseElements)
    // - At least 2 reviews in same level (re-review)
    // - At least 2 reviews in previous level lowerLevelReview (that aren't duplications)
    element.enableViewHistory =
      (isMakeDecision && elementThisReviewResponses.length > 0) ||
      element.enableViewHistory ||
      hasLowerLevelReviewResponsesHistory ||
      hasThisReviewResponsesHistory
  })

  return structure
}

const addIsAssigned = (newStructure: FullStructure, reviewAssignment: AssignmentDetails) => {
  const assignedSections = reviewAssignment.assignedSections
  const assignedElements = Object.entries(newStructure?.elementsById as ElementsById).filter(
    ([_, element]) =>
      assignedSections.includes(element.element.sectionCode) &&
      element.element.category === 'QUESTION'
  )
  assignedElements.forEach(([id, _]) => {
    const assignedElement = newStructure?.elementsById?.[id || '']
    if (!assignedElement) return

    assignedElement.isAssigned = true
  })
  return newStructure
}

export { generateReviewStructure, getSectionIds, compileVariablesForReviewResponseQuery }
