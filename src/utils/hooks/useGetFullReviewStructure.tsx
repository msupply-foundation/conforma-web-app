import { useState, useEffect } from 'react'
import { AssignmentDetailsNEW, FullStructure, SectionStateNEW } from '../types'
import {
  ReviewQuestionAssignment,
  ReviewResponse,
  useGetReviewResponsesQuery,
} from '../generated/graphql'
import { useUserState } from '../../contexts/UserState'
import { cloneDeep } from '@apollo/client/utilities'
import {
  addElementsById,
  addSortedSectionsAndPages,
  addThisReviewResponses,
  generateReviewProgress,
  generateReviewSectionActions,
} from '../helpers/structure'

interface useGetFullReviewStructureProps {
  fullApplicationStructure: FullStructure
  reviewAssignment: AssignmentDetailsNEW
  filteredSectionIds?: number[]
  awaitMode?: boolean
}

interface AwaitModeResolver {
  awaitMethod: (reslt: FullStructure | null) => void
}

const useGetFullReviewStructure = ({
  fullApplicationStructure,
  reviewAssignment,
  filteredSectionIds,
  awaitMode = false,
}: useGetFullReviewStructureProps) => {
  const [fullReviewStructure, setFullReviewStructure] = useState<FullStructure>()
  const [awaitModeTrigger, setAwaitModeTrigger] = useState(awaitMode)
  const [awaitModeResolver, setAwaitModeResolver] = useState<AwaitModeResolver | null>(null)

  const {
    userState: { currentUser },
  } = useUserState()

  // filter by all sections if sections are not supplied
  const sectionIds =
    filteredSectionIds ||
    Object.values(fullApplicationStructure.sections).map((section) => section.details.id) ||
    []

  const { data, error } = useGetReviewResponsesQuery({
    variables: {
      reviewAssignmentId: reviewAssignment.id as number,
      userId: currentUser?.userId as number,
      sectionIds,
    },
    fetchPolicy: 'network-only',
    skip: awaitModeTrigger,
  })

  useEffect(() => {
    if (error) {
      console.log(error)
      if (awaitModeResolver) awaitModeResolver.awaitMethod(null)
      return
    }

    if (!data) return
    // requires deep clone one we have concurrent useGetFullReviewStructure that could possibly
    // mutate fullApplicationStructure
    let newStructure: FullStructure = cloneDeep(fullApplicationStructure)

    // This is usefull for linking assignments to elements
    newStructure = addElementsById(newStructure)
    newStructure = addSortedSectionsAndPages(newStructure)

    newStructure = addIsAssigned(newStructure, reviewAssignment.reviewQuestionAssignments)

    // here we add responses from other review (not from this review assignmnet)

    setIsNewApplicationResponse(newStructure)

    if ((data.reviewAssignment?.reviews?.nodes?.length || 0) > 1)
      console.error(
        'More then one review associated with reviewAssignment with id',
        reviewAssignment.id
      )
    // There will always just be one review assignment linked to a review. (since review is related to reviewAssignment, many to one relation is created)
    const reviewResponses = data?.reviewAssignment?.reviews?.nodes[0]?.reviewResponses.nodes
    if (reviewResponses) {
      newStructure = addThisReviewResponses({
        structure: newStructure,
        sortedReviewResponses: reviewResponses as ReviewResponse[], // Sorted in useGetReviewResponsesQuery
      })
    }
    // review info comes from reviewAssignment that's passed to this hook
    newStructure.thisReview = reviewAssignment.review

    generateReviewProgress(newStructure)

    // filter by supplied sections or by all sections if none supplied to the hook
    const sections = getFilteredSections(sectionIds, newStructure.sortedSections || [])
    generateReviewSectionActions({
      sections,
      reviewAssignment,
      thisReview: newStructure.thisReview,
      currentUserId: currentUser?.userId as number,
    })

    // generateConsolidationProgress
    if (awaitMode && awaitModeResolver) awaitModeResolver.awaitMethod(newStructure)
    setFullReviewStructure(newStructure)
  }, [data, error])

  const getFullReviewStructureAsync = () =>
    new Promise<FullStructure>((resolve, reject) => {
      const awaitMethod = (newStructure: FullStructure | null) => {
        setAwaitModeTrigger(true)
        if (!newStructure) return reject(new Error('Failed to load structure'))
        resolve(newStructure)
        setAwaitModeResolver(null)
      }

      setAwaitModeResolver({ awaitMethod })
      setAwaitModeTrigger(false)
    })

  return {
    fullReviewStructure,
    error: error?.message,
    getFullReviewStructureAsync,
  }
}

const setIsNewApplicationResponse = (structure: FullStructure) => {
  Object.values(structure.elementsById || {}).forEach((element) => {
    element.isNewApplicationResponse =
      element?.latestApplicationResponse?.timeUpdated === structure.info.current?.date &&
      !!element?.previousApplicationResponse
  })
}

const getFilteredSections = (sectionIds: number[], sections: SectionStateNEW[]) => {
  return sections.filter((section) =>
    sectionIds.find((sectionId) => section.details.id === sectionId)
  )
}

const addIsAssigned = (
  newStructure: FullStructure,
  reviewQuestionAssignment: ReviewQuestionAssignment[]
) => {
  reviewQuestionAssignment.forEach(({ templateElementId, id }) => {
    const assignedElement = newStructure?.elementsById?.[templateElementId || '']

    if (!assignedElement) return

    assignedElement.isAssigned = true
    assignedElement.assignmentId = id
  })
  return newStructure
}

export default useGetFullReviewStructure
