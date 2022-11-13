import { useEffect, useState } from 'react'
import { ALL_LEVELS } from '../../containers/Review/assignment/ReviewLevel'
import { useUserState } from '../../contexts/UserState'
import { ApplicationDetails, AssignmentDetails, Filters, LevelAssignments } from '../types'
import useGetReviewInfo from './useGetReviewInfo'

interface UseGetAssignmentProps {
  info: ApplicationDetails
  filters: Filters | null
  sectionCodes: string[]
}

const useLoadAssignments = ({
  info: { id, serial },
  filters,
  sectionCodes,
}: UseGetAssignmentProps) => {
  const [assignmentsFiltered, setAssignmentsFiltered] = useState<AssignmentDetails[]>([])

  const {
    userState: { currentUser },
  } = useUserState()

  // Already checks for usTriggers internally (to check ReviewAssignments trigger)
  const { error, loading, assignments } = useGetReviewInfo({
    applicationId: id,
    serial,
    userId: currentUser?.userId as number,
    skip: filters === null,
  })

  useEffect(() => {
    if (assignments) {
      const filteredByLevel = getFilteredLevel(assignments)
      setAssignmentsFiltered(filteredByLevel)
    }
  }, [assignments])

  const getFilteredLevel = (assignments: AssignmentDetails[]) => {
    if (!filters) return []
    return assignments
      .filter((assignment) => assignment.current.stage.number === filters.currentStage)
      .filter(
        (assignment) =>
          filters.selectedLevel === ALL_LEVELS || assignment.level === filters.selectedLevel
      )
  }

  const assignmentGroupedLevel: LevelAssignments = {}
  assignmentsFiltered.forEach((assignment) => {
    const { level } = assignment
    if (!assignmentGroupedLevel[level]) assignmentGroupedLevel[level] = [assignment]
    else assignmentGroupedLevel[level].push(assignment)
  })

  const currentReviewLevel = Math.max(Number(Object.keys(assignmentGroupedLevel)))

  const isFullyAssigned = currentReviewLevel
    ? calculateIsFullyAssigned(assignmentGroupedLevel[currentReviewLevel], sectionCodes)
    : true

  return {
    error,
    loading,
    assignmentsFiltered,
    assignmentGroupedLevel,
    isFullyAssigned,
  }
}

export default useLoadAssignments

const calculateIsFullyAssigned = (
  currentLevelAssignments: AssignmentDetails[],
  sectionCodes: string[]
) => {
  const assignedSections = new Set(
    currentLevelAssignments
      // .filter((assignment) => assignment.current.assignmentStatus === ReviewAssignmentStatus.Assigned)
      .map((assignment) => assignment.assignedSections)
      .flat()
  )

  return assignedSections.size >= sectionCodes.length
}
