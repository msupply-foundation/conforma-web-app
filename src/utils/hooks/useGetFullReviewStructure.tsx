import { useState, useEffect } from 'react'
import { FullStructure } from '../types'
import {
  Review,
  ReviewResponse,
  useGetReviewNewQuery,
  ReviewQuestionAssignment,
} from '../generated/graphql'
import { useUserState } from '../../contexts/UserState'
import addThisReviewResponses from '../helpers/structure/addThisReviewResponses'
import addElementsById from '../helpers/structure/addElementsById'
import generateReviewProgress from '../helpers/structure/generateReviewProgress'

interface useGetFullReviewStructureProps {
  fullApplicationStructure: FullStructure
  reviewAssignmentId: number
  filteredSectionIds?: number[]
}

const useGetFullReviewStructure = ({
  fullApplicationStructure,
  reviewAssignmentId,
  filteredSectionIds,
}: useGetFullReviewStructureProps) => {
  const [fullReviewStructure, setFullReviewStructure] = useState<FullStructure>()
  const [structureError, setStructureError] = useState('')

  const {
    userState: { currentUser },
  } = useUserState()

  // filter by all sections if sections are not supplied
  const sectionIds =
    filteredSectionIds ||
    fullApplicationStructure?.sortedSections?.map((section) => section.details.id) ||
    []

  console.log({ sectionIds })

  const { data, error } = useGetReviewNewQuery({
    variables: {
      reviewAssignmentId,
      userId: currentUser?.userId as number,
      sectionIds,
    },
  })

  useEffect(() => {
    console.log(fullApplicationStructure)
    if (error) return

    if (!data) return

    const reviewAssignment = data.reviewAssignment
    if (!reviewAssignment) return setStructureError('Cannot find review Assignment')

    // This is usefull for linking assignments to elements
    let newStructure: FullStructure = addElementsById(fullApplicationStructure)

    const reviewQuestionAssignments = reviewAssignment.reviewQuestionAssignments?.nodes
    if (reviewQuestionAssignments)
      newStructure = addIsAssigned(
        newStructure,
        reviewQuestionAssignments as ReviewQuestionAssignment[]
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
    }

    generateReviewProgress(newStructure)
    // generateConsolidationProgress
    setFullReviewStructure(newStructure)
  }, [data, error])

  return {
    fullReviewStructure,
    error: structureError || error?.message,
  }
}
const addIsAssigned = (
  newStructure: FullStructure,
  reviewQuestionAssignments: ReviewQuestionAssignment[]
) => {
  reviewQuestionAssignments.forEach((questionAssignment) => {
    if (!questionAssignment) return

    const assignedElement =
      newStructure?.elementsById?.[questionAssignment.templateElementId as number]
    if (!assignedElement) return

    assignedElement.isAssigned = true
  })

  return newStructure
}

export default useGetFullReviewStructure
