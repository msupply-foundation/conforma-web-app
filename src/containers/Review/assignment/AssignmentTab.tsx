import React, { useState } from 'react'
import { Container, Label, Message } from 'semantic-ui-react'
import Loading from '../../../components/Loading'
import Assignment from './Assignment'
import { useUserState } from '../../../contexts/UserState'
import {
  AssignedSectionsByLevel,
  AssignmentDetails,
  Filters,
  FullStructure,
  LevelAssignments,
} from '../../../utils/types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { Stage } from '../../../components/Review'
import { getPreviousStageAssignment } from '../../../utils/helpers/assignment/getPreviousStageAssignment'
import useGetReviewInfo from '../../../utils/hooks/useGetReviewInfo'
import { NoMatch } from '../../../components'
import ReviewLevel, { ALL_LEVELS } from './ReviewLevel'
import { ReviewStateProvider } from '../../../contexts/ReviewStructuresState'
import AssignmentRows from './AssignmentRows'
import AssignmentSubmit from './AssignmentSubmit'
import { ApplicationOutcome } from '../../../utils/generated/graphql'

const AssignmentTab: React.FC<{
  fullApplicationStructure: FullStructure
}> = ({ fullApplicationStructure: fullStructure }) => {
  const { strings } = useLanguageProvider()
  const {
    userState: { currentUser },
  } = useUserState()
  const [enableSubmit, setEnableSubmit] = useState<boolean>(false)
  const [assignedSectionsByLevel, setAssignedSectionsByLevel] = useState<AssignedSectionsByLevel>(
    {}
  )
  const [assignmentError, setAssignmentError] = useState<string | null>(null)

  const { error, loading, assignments } = useGetReviewInfo({
    applicationId: fullStructure.info.id,
    serial: fullStructure.info.serial,
    userId: currentUser?.userId as number,
  })

  const [filters, setFilters] = useState<Filters | null>(null)

  const getFilteredByStage = (assignments: AssignmentDetails[]) => {
    if (!filters) return []
    return assignments.filter(
      (assignment) => assignment.current.stage.number === filters.currentStage
    )
  }

  const getFilteredLevel = (assignments: AssignmentDetails[]) => {
    if (!filters) return []
    return getFilteredByStage(assignments).filter(
      (assignment) =>
        filters.selectedLevel === ALL_LEVELS || assignment.level === filters.selectedLevel
    )
  }

  if (error) return <Message error header={strings.ERROR_REVIEW_PAGE} list={[error]} />

  if (loading || !fullStructure) return <Loading />
  if (!assignments || assignments.length === 0) return <NoMatch />

  // Get Previous stage (last level reviewer) assignment
  const assignmentInPreviousStage = getPreviousStageAssignment(
    fullStructure.info.serial,
    assignments,
    filters?.currentStage
  )

  const {
    info: {
      current: {
        stage: { name: stageName, colour: stageColour },
      },
    },
  } = fullStructure

  const assignmentsFiltered = getFilteredLevel(assignments)

  const assignmentGroupedLevel: LevelAssignments = {}
  assignmentsFiltered.forEach((assignment) => {
    const { level } = assignment
    if (!assignmentGroupedLevel[level]) assignmentGroupedLevel[level] = [assignment]
    else assignmentGroupedLevel[level].push(assignment)
  })

  return (
    <ReviewStateProvider fullApplicationStructure={fullStructure} assignments={assignmentsFiltered}>
      <Container id="assignment-tab">
        {assignmentError && (
          <Message
            icon="warning"
            size="small"
            error
            header={strings.ASSIGNMENT_ERROR_TITLE}
            content={assignmentError}
          />
        )}
        <div className="flex-row-space-between-center" id="review-filters-container">
          <ReviewLevel
            filters={filters}
            setFilters={setFilters}
            structure={fullStructure}
            assignments={assignments}
          />
          <div className="centered-flex-box-row">
            <Label className="uppercase-label" content={strings.REVIEW_OVERVIEW_STAGE} />
            <Stage name={stageName} colour={stageColour || ''} />
          </div>
        </div>
        {/* Creates each reviewStructuse in context ReviewsStateContext */}
        {assignmentsFiltered.map((assignment) => (
          <Assignment
            key={`assginment_struct_${assignment.id}`}
            assignment={assignment}
            structure={fullStructure}
          />
        ))}
        {/* Then render each Assignment/Review section rows using the reviewStructures generated */}
        <AssignmentRows
          fullStructure={fullStructure}
          assignmentInPreviousStage={assignmentInPreviousStage}
          assignmentGroupedLevel={assignmentGroupedLevel}
          assignedSectionsByLevel={assignedSectionsByLevel}
          setAssignedSectionsByLevel={setAssignedSectionsByLevel}
          setEnableSubmit={setEnableSubmit}
          setAssignmentError={setAssignmentError}
        />
        {fullStructure.info.outcome === ApplicationOutcome.Pending && (
          <AssignmentSubmit
            fullStructure={fullStructure}
            assignedSectionsByLevel={assignedSectionsByLevel}
            assignmentsFiltered={assignmentsFiltered}
            enableSubmit={enableSubmit}
            setAssignmentError={setAssignmentError}
          />
        )}
      </Container>
    </ReviewStateProvider>
  )
}

export default AssignmentTab
