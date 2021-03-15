import { useState, useEffect } from 'react'
import { AssignmentDetailsNEW, FullStructure } from '../types'
import { Review, ReviewResponse, useGetReviewResponsesQuery, User } from '../generated/graphql'
import { useUserState } from '../../contexts/UserState'
import addThisReviewResponses from '../helpers/structure/addThisReviewResponses'
import addElementsById from '../helpers/structure/addElementsById'
import generateReviewProgress from '../helpers/structure/generateReviewProgress'

interface useGetFullReviewStructureProps {
  fullApplicationStructure: FullStructure
  reviewAssignment: AssignmentDetailsNEW
  filteredSectionIds?: number[]
}

const useGetFullReviewStructure = ({
  fullApplicationStructure,
  reviewAssignment,
  filteredSectionIds,
}: useGetFullReviewStructureProps) => {
  const [fullReviewStructure, setFullReviewStructure] = useState<FullStructure>()

  const {
    userState: { currentUser },
  } = useUserState()

  // filter by all sections if sections are not supplied
  const sectionIds =
    filteredSectionIds ||
    fullApplicationStructure?.sortedSections?.map((section) => section.details.id) ||
    []

  const { data, error } = useGetReviewResponsesQuery({
    variables: {
      reviewAssignmentId: reviewAssignment.id as number,
      userId: currentUser?.userId as number,
      sectionIds,
    },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (error) return

    if (!data) return

    // This is usefull for linking assignments to elements
    let newStructure: FullStructure = addElementsById(fullApplicationStructure)

    newStructure = addIsAssigned(
      newStructure,
      reviewAssignment.assignedTemplateElementIds,
      reviewAssignment.reviewer
    )

    // here we add responses from other review (not from this review assignmnet)

    // There will always just be one review assignment linked to a review. (since review is related to reviewAssignment, many to one relation is created)
    const review = data?.reviewAssignment?.reviews?.nodes[0] as Review
    if ((data.reviewAssignment?.reviews?.nodes?.length || 0) > 1)
      console.error(
        'More then one review associated with reviewAssignment with id',
        reviewAssignment.id
      )
    if (review) {
      newStructure = addThisReviewResponses({
        structure: newStructure,
        sortedReviewResponses: review?.reviewResponses.nodes as ReviewResponse[], // Sorted in useGetReviewNewQuery
      })

      // TODO talk to team and decide if we should put everything in full structure (join all of required info from reviewAssignment ?)
      newStructure.thisReview = reviewAssignment.review
    }

    generateReviewProgress(newStructure)
    // generateConsolidationProgress
    setFullReviewStructure(newStructure)
  }, [data, error])

  return {
    fullReviewStructure,
    error: error?.message,
  }
}

const addIsAssigned = (
  newStructure: FullStructure,
  assignedTemplateElementIds: number[],
  reviewer: User
) => {
  assignedTemplateElementIds.forEach((templateElementId) => {
    const assignedElement = newStructure?.elementsById?.[templateElementId]

    if (!assignedElement) return

    assignedElement.isAssigned = true
    // Check if section already assigned and set assigned user otherwise
    const section = newStructure.sections[assignedElement.element.sectionCode]
    if (!section.assigned)
      section.assigned = {
        id: reviewer.id,
        firstName: reviewer.firstName as string,
        lastName: reviewer.lastName as string,
        current: true,
      }
  })

  return newStructure
}

export default useGetFullReviewStructure
