import { useEffect, useState } from 'react'
import { AssignmentDetails } from '../types'
import {
  Review,
  ReviewAssignment,
  ReviewAssignmentStatus,
  ReviewQuestionAssignment,
  ReviewStatus,
  useGetReviewInfoQuery,
  User,
} from '../generated/graphql'
import { useLanguageProvider } from '../../contexts/Localisation'
import { useUserState } from '../../contexts/UserState'
import useTriggers from './useTriggers'

interface UseGetReviewInfoProps {
  applicationId: number
  serial: string
  userId: number
}

const useGetReviewInfo = ({ applicationId, serial }: UseGetReviewInfoProps) => {
  const { strings } = useLanguageProvider()
  const [assignments, setAssignments] = useState<AssignmentDetails[]>()
  const [isFetching, setIsFetching] = useState(true)
  const [fetchingError, setFetchingError] = useState('')
  const {
    userState: { currentUser },
  } = useUserState()

  const {
    ready: triggersReady,
    loading: triggersLoading,
    error: triggersError,
    recheckTriggers,
  } = useTriggers(serial)

  const { data, loading, error } = useGetReviewInfoQuery({
    variables: {
      applicationId,
      assignerId: currentUser?.userId as number,
    },
    notifyOnNetworkStatusChange: true,
    // if this is removed, there might be an infinite loading when looking at a review for the frist time, after clearing cache
    // it's either this or removing 'totalCount' in `reviewQuestionAssignments` from this query
    // ended up removing totalCount from query and keeping this as nextFetchPolicy (was still seeing glitched with totalCount and had "can't update unmounted component error")
    fetchPolicy: 'network-only',
    skip: !triggersReady,
  })

  useEffect(() => {
    if (triggersError) {
      setFetchingError(strings.TRIGGER_ERROR)
      console.error('Trigger error:', triggersError)
      return
    }
    if (loading || triggersLoading) return setIsFetching(true)

    if (!data || !triggersReady) return

    const reviewAssigments = data.reviewAssignments?.nodes as ReviewAssignment[]

    // Current user has no assignments
    if (!reviewAssigments) {
      setIsFetching(false)
      return
    }

    const assignments: AssignmentDetails[] = reviewAssigments.map((reviewAssignment) => {
      // There will always just be one review assignment linked to a review.
      const review = reviewAssignment.reviews.nodes[0] as Review
      if (reviewAssignment.reviews.nodes.length > 1)
        console.error(
          'More then one review associated with reviewAssignment with id',
          reviewAssignment.id
        )

      const {
        id,
        status: assignmentStatus,
        stage: assignmentStage,
        timeStageCreated,
        timeUpdated: timeStatusUpdated,
        levelNumber,
        reviewer,
        reviewAssignmentAssignerJoins,
        allowedSections,
        assignedSections,
        isFinalDecision,
        isLastLevel,
        isSelfAssignable,
        isLocked,
      } = reviewAssignment

      // Extra field just to use in initial example - might conflict with future queries
      // to get reviewQuestionAssignment
      const reviewQuestionAssignments = (reviewAssignment.reviewQuestionAssignments.nodes ||
        []) as ReviewQuestionAssignment[]
      const totalAssignedQuestions = reviewQuestionAssignments.length

      const stage = {
        id: assignmentStage?.id as number,
        name: assignmentStage?.title as string,
        number: assignmentStage?.number as number,
        colour: assignmentStage?.colour as string,
      }

      const assignment: AssignmentDetails = {
        id,
        reviewer: reviewer as User,
        level: levelNumber || 1,
        current: {
          stage,
          assignmentStatus,
          timeStageCreated,
          timeStatusUpdated,
        },
        isCurrentUserReviewer: reviewer?.id === (currentUser?.userId as number),
        isCurrentUserAssigner: reviewAssignmentAssignerJoins.nodes.length > 0,
        isFinalDecision: !!isFinalDecision,
        isLastLevel: !!isLastLevel,
        isSelfAssignable: !!isSelfAssignable,
        isLocked: !!isLocked,
        allowedSections: (allowedSections as string[]) || [],
        assignedSections: assignedSections as string[],
        totalAssignedQuestions,
        reviewQuestionAssignments,
        review: review
          ? {
              id: review.id,
              level: review.levelNumber || 0,
              current: {
                stage,
                timeStageCreated,
                reviewStatus: review.status as ReviewStatus,
                timeStatusCreated: review.timeStatusCreated,
              },
              reviewDecision: review.reviewDecisions.nodes[0], // this will be the latest, sorted in query
              reviewer: reviewer as User,
            }
          : null,
      }

      migrationCode_2_0_0(assignment)

      return assignment
    })

    setAssignments(assignments)
    setIsFetching(false)
  }, [data, loading, triggersReady, triggersLoading, triggersError])

  return {
    error: fetchingError || error?.message,
    loading: loading || isFetching,
    assignments,
  }
}

const migrationCode_2_0_0 = (assignment: AssignmentDetails) => {
  const {
    current: { assignmentStatus },
    assignedSections,
    reviewQuestionAssignments,
  } = assignment
  if (assignmentStatus === ReviewAssignmentStatus.Assigned) {
    // When Assigned without assignedSections and with assigned questions - showing incosistency
    // due to previous versions (<2.0.0) wasn't using the assignedSections field. Update!
    if (assignedSections.length === 0 && reviewQuestionAssignments.length !== 0) {
      assignment.assignedSections = reviewQuestionAssignments.reduce(
        (assignedSections: string[], { templateElement }) => {
          const code = templateElement?.section?.code as string
          if (!assignedSections.includes(code)) assignedSections.push(code)
          return assignedSections.sort()
        },
        []
      )
    }
  }
}

export default useGetReviewInfo
