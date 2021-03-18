import React, { useEffect, useState } from 'react'
import { Message, Segment, Header, Checkbox, Dropdown, Grid } from 'semantic-ui-react'
import { Loading } from '../../components'
import { useUserState } from '../../contexts/UserState'
import strings from '../../utils/constants'
import useGetFullApplicationStructure from '../../utils/hooks/useGetFullApplicationStructure'
import { AssignmentDetailsNEW, FullStructure } from '../../utils/types'
import ReviewSectionRow from './ReviewSectionRow'

interface ReviewHomeProps {
  assignments: AssignmentDetailsNEW[]
  structure: FullStructure
}

type Filters = {
  selectedReviewer: number
  selectedStage: number
}

const ALL_REVIEWERS = -1

const ReviewHome: React.FC<ReviewHomeProps> = ({ assignments, structure }) => {
  const { error, fullStructure: fullApplicationStructure } = useGetFullApplicationStructure({
    structure,
    firstRunValidation: false,
    shouldCalculateProgress: false,
  })

  const [filters, setFilters] = useState<Filters | null>(null)

  const getFilteredReviewer = (assignments: AssignmentDetailsNEW[]) => {
    if (!filters) return []
    return assignments.filter(
      (assignment) =>
        (filters.selectedReviewer === ALL_REVIEWERS ||
          assignment.reviewer.id === filters.selectedReviewer) &&
        assignment.stage.id === filters.selectedStage
    )
  }

  if (error) return <Message error title={strings.ERROR_GENERIC} list={[error]} />

  if (!fullApplicationStructure) return <Loading />

  const reviewerAndStageSelectionProps: ReviewerAndStageSelectionProps = {
    filters,
    setFilters,
    structure: fullApplicationStructure,
    assignments,
  }

  return (
    <>
      <ReviewerAndStageSelection {...reviewerAndStageSelectionProps} />
      {filters &&
        Object.values(fullApplicationStructure.sections).map(({ details: { id, title } }) => (
          <Segment key={id}>
            <Header>{title}</Header>
            {getFilteredReviewer(assignments).map((assignment) => (
              <ReviewSectionRow
                {...{
                  key: assignment.id,
                  sectionId: id,
                  assignment,
                  fullApplicationStructure,
                }}
              />
            ))}
          </Segment>
        ))}
    </>
  )
}

type ReviewerAndStageSelectionProps = {
  filters: Filters | null
  setFilters: (filters: Filters) => void
  structure: FullStructure
  assignments: AssignmentDetailsNEW[]
}

const ReviewerAndStageSelection: React.FC<ReviewerAndStageSelectionProps> = ({
  assignments,
  structure,
  filters,
  setFilters,
}) => {
  const {
    userState: { currentUser },
  } = useUserState()

  useEffect(() => {
    setFilters({
      selectedReviewer: currentUser?.userId || ALL_REVIEWERS,
      selectedStage: structure.info.current?.stage.id || 0,
    })
  }, [])

  const changeFilters = (filterType: keyof Filters) => (_: any, { value }: any) => {
    if (filters) setFilters({ ...filters, [filterType]: value })
  }

  if (!filters) return null

  return (
    <Grid columns="equal">
      <Grid.Column floated="left">
        Show tasks for{' '}
        <Dropdown
          options={getReviewerOptions(assignments, currentUser?.userId || 0)}
          value={filters?.selectedReviewer}
          onChange={changeFilters('selectedReviewer')}
        />
      </Grid.Column>
      <Grid.Column floated="right" textAlign="right">
        STAGE{' '}
        <Dropdown
          options={getStageOptions(structure, assignments)}
          value={filters?.selectedStage}
          onChange={changeFilters('selectedStage')}
        />
      </Grid.Column>
    </Grid>
  )
}

const getStageOptions = (structure: FullStructure, assignments: AssignmentDetailsNEW[]) =>
  structure.stages
    .filter(({ id }) => assignments.some(({ stage }) => id === stage.id))
    .map(({ id, title }) => ({
      key: id,
      value: id,
      text: title,
    }))

const getReviewerOptions = (assignments: AssignmentDetailsNEW[], currentUserId: number) => {
  const reviewerOptions: { value: number; key: number; text: string }[] = [
    {
      value: ALL_REVIEWERS,
      key: ALL_REVIEWERS,
      text: 'All',
    },
    {
      value: currentUserId,
      key: currentUserId,
      text: 'Yourself',
    },
  ]
  assignments.forEach(({ reviewer: { id, firstName, lastName } }) => {
    if (id === currentUserId || !id || !firstName || !lastName) return
    reviewerOptions.push({
      value: id,
      key: id,
      text: `${firstName} ${lastName}`,
    })
  })

  return reviewerOptions
}

export default ReviewHome
