import { useState, useEffect } from 'react'
import { FullStructure } from '../types'
import {
  ApplicationResponse,
  Review,
  ReviewAssignment,
  ReviewResponse,
  useGetReviewNewQuery,
} from '../generated/graphql'
import addEvaluatedResponsesToStructure from '../helpers/structure/addEvaluatedResponsesToStructure'
import { useUserState } from '../../contexts/UserState'
import addThisReviewResponses from '../helpers/structure/addThisReviewResponses'
import addElementsById from '../helpers/structure/addElementsById'

interface useGetFullReviewStructureProps {
  structure: FullStructure
  reviewAssignmentId: number
}

const useGetFullReviewStructure = ({
  structure,
  reviewAssignmentId,
}: useGetFullReviewStructureProps) => {
  const [fullStructure, setFullStructure] = useState<FullStructure>()

  const {
    userState: { currentUser },
  } = useUserState()

  const { data, error } = useGetReviewNewQuery({
    variables: {
      reviewAssignmentId,
      userId: currentUser?.userId as number,
    },
  })

  useEffect(() => {
    if (error) return

    if (!data) return

    addEvaluatedResponsesToStructure({
      structure,
      applicationResponses: data?.reviewAssignment?.application?.applicationResponses
        ?.nodes as ApplicationResponse[],
      currentUser,
      evaluationOptions: {
        isEditable: false,
        isVisible: true,
        isRequired: false,
        isValid: false,
      },
    }).then((evaluatedStructure: FullStructure) => {
      let newStructure: FullStructure = addElementsById(evaluatedStructure)

      // here we add responses from other review (not from this review assignmnet)

      // There will always just be one review assignment linked to a review. (since review is related to reviewAssignment, many to one relation is created)
      const review = data?.reviewAssignment?.reviews?.nodes[0] as Review
      if ((data.reviewAssignment?.reviews?.nodes?.length || 0) > 1)
        console.error(
          'More then one review associated with reviewAssignment with id',
          data.reviewAssignment?.id
        )
      if (review) {
        newStructure = addThisReviewResponses({
          structure: newStructure,
          sortedReviewResponses: review?.reviewResponses.nodes as ReviewResponse[], // Sorted in useGetReviewNewQuery
        })
      }

      // Generate review progress

      setFullStructure(newStructure)
    })
  }, [data, error])

  return {
    fullStructure,
    error: error?.message,
  }
}

export default useGetFullReviewStructure
