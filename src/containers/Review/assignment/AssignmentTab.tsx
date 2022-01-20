import React, { useEffect, useState } from 'react'
import { Container, Dropdown, Label, Message } from 'semantic-ui-react'
import Loading from '../../../components/Loading'
import Assignment from './Assignment'
import { useUserState } from '../../../contexts/UserState'
import { AssignmentDetails, Filters, FullStructure } from '../../../utils/types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { Stage } from '../../../components/Review'
import { getPreviousStageAssignment } from '../../../utils/helpers/assignment/getPreviousStageAssignment'
import useGetReviewInfo from '../../../utils/hooks/useGetReviewInfo'
import { NoMatch } from '../../../components'

const ALL_REVIEWERS = 0

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

  const getFilteredReviewer = (assignments: AssignmentDetails[]) => {
    if (!filters) return []
    return getFilteredByStage(assignments).filter(
      (assignment) =>
        filters.selectedReviewer === ALL_REVIEWERS ||
        assignment.reviewer.id === filters.selectedReviewer
    )
  }

  if (error) return <Message error header={strings.ERROR_REVIEW_PAGE} list={[error]} />

  if (loading || !fullStructure) return <Loading />
  if (!assignments || assignments.length === 0) return <NoMatch />

  const reviewerAndStageSelectionProps: ReviewerAndStageSelectionProps = {
    filters,
    setFilters,
    structure: fullStructure,
    assignments,
  }

  // Get Previous stage (last level reviewer) assignment
  const assignmentInPreviousStage = getPreviousStageAssignment(
    fullStructure.info.serial,
    assignments,
    filters?.selectedStage
  )

  const {
    info: { template, org, name },
  } = fullStructure

  return (
    <Container id="assignment-tab">
      <ReviewerAndStageSelection {...reviewerAndStageSelectionProps} />
      {filters && (
        <Assignment
          assignmentsByStage={getFilteredByStage(assignments)}
          assignmentsByUserAndStage={getFilteredReviewer(assignments)}
          assignmentInPreviousStage={assignmentInPreviousStage}
          fullApplicationStructure={fullStructure}
        />
      )}
    </Container>
  )
}

type ReviewerAndStageSelectionProps = {
  filters: Filters | null
  setFilters: (filters: Filters) => void
  structure: FullStructure
  assignments: AssignmentDetails[]
}

const ReviewerAndStageSelection: React.FC<ReviewerAndStageSelectionProps> = ({
  assignments,
  structure,
  filters,
  setFilters,
}) => {
  const { strings } = useLanguageProvider()
  const { getStageOptions, getReviewerOptions } = useHelpers()
  const {
    userState: { currentUser },
  } = useUserState()

  useEffect(() => {
    setFilters({
      selectedReviewer: currentUser?.userId as number,
      selectedStage: structure.info.current.stage.number,
    })
  }, [])

  const changeFilters =
    (filterType: keyof Filters) =>
    (_: any, { value }: any) => {
      if (filters) setFilters({ ...filters, [filterType]: value })
    }

  if (!filters) return null

  const stageOptions = getStageOptions(structure, assignments)

  return (
    <div className="section-single-row-box-container" id="review-filters-container">
      <div className="centered-flex-box-row">
        <Label className="simple-label" content={strings.REVIEW_FILTER_SHOW_TASKS_FOR} />
        <Dropdown
          className="reviewer-dropdown"
          options={getReviewerOptions(assignments, currentUser?.userId as number)}
          value={filters?.selectedReviewer}
          onChange={changeFilters('selectedReviewer')}
        />
      </div>
      <div className="centered-flex-box-row">
        <Label className="uppercase-label" content={strings.REVIEW_FILTER_STAGE} />
        <Dropdown
          options={stageOptions}
          value={filters?.selectedStage}
          onChange={changeFilters('selectedStage')}
        />
      </div>
    </div>
  )
}

const useHelpers = () => {
  const { strings } = useLanguageProvider()

  const getStageOptions = (structure: FullStructure, assignments: AssignmentDetails[]) =>
    structure.stages
      .filter(({ number }) => assignments.some(({ current: { stage } }) => number === stage.number))
      .map(({ number, name, colour }) => ({
        className: 'padding-zero',
        key: number,
        value: number,
        text: <Stage name={name} colour={colour || ''} />,
      }))

  const getReviewerOptions = (assignments: AssignmentDetails[], currentUserId: number) => {
    const reviewerOptions: { value: number; key: number; text: string }[] = [
      {
        value: ALL_REVIEWERS,
        key: ALL_REVIEWERS,
        text: strings.REVIEW_FILTER_EVERYONE,
      },
      {
        value: currentUserId,
        key: currentUserId,
        text: strings.REVIEW_FILTER_YOURSELF,
      },
    ]
    assignments.forEach(({ reviewer: { id, username } }) => {
      if (!id || !username) return
      if (reviewerOptions.some((option) => option.key === id)) return
      reviewerOptions.push({
        value: id,
        key: id,
        text: username,
      })
    })

    return reviewerOptions
  }

  return { getStageOptions, getReviewerOptions }
}

export default AssignmentTab
