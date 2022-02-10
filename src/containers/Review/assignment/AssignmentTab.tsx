import React, { useState } from 'react'
import { Container, Label, Message } from 'semantic-ui-react'
import Loading from '../../../components/Loading'
import Assignment from './Assignment'
import { useUserState } from '../../../contexts/UserState'
import { AssignmentDetails, Filters, FullStructure } from '../../../utils/types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { Stage } from '../../../components/Review'
import { getPreviousStageAssignment } from '../../../utils/helpers/assignment/getPreviousStageAssignment'
import useGetReviewInfo from '../../../utils/hooks/useGetReviewInfo'
import { NoMatch } from '../../../components'
import ReviewLevel, { ALL_LEVELS } from './ReviewLevel'

const AssignmentTab: React.FC<{
  structure: FullStructure
}> = ({ structure: fullStructure }) => {
  const { strings } = useLanguageProvider()
  const {
    userState: { currentUser },
  } = useUserState()

  const { error, loading, assignments } = useGetReviewInfo({
    applicationId: fullStructure.info.id,
    userId: currentUser?.userId as number,
  })

  const [filters, setFilters] = useState<Filters | null>(null)

  const getFilteredByStage = (assignments: AssignmentDetails[]) => {
    if (!filters) return []
    return assignments.filter(
      (assignment) => assignment.current.stage.number === filters.selectedStage
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
    filters?.selectedStage
  )

  const {
    info: {
      current: {
        stage: { name: stageName, colour: stageColour },
      },
    },
  } = fullStructure

  return (
    <Container id="assignment-tab">
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
      {filters && (
        <Assignment
          filters={filters}
          assignmentsByStageAndLevel={getFilteredLevel(assignments)}
          assignmentInPreviousStage={assignmentInPreviousStage}
          fullApplicationStructure={fullStructure}
        />
      )}
    </Container>
  )
}

export default AssignmentTab
