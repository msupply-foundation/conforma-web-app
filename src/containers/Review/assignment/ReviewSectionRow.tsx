import React, { useEffect } from 'react'
import { Grid, Message } from 'semantic-ui-react'
import LoadingSmall from '../../../components/LoadingSmall'
import {
  ReviewSectionRowAssigned,
  ReviewSectionRowLastActionDate,
  ReviewSectionRowProgress,
  ReviewSectionRowAction,
} from '../../../components/Review'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { useReviewStructureState } from '../../../contexts/ReviewStructuresState'
import useGetReviewStructureForSections from '../../../utils/hooks/useGetReviewStructureForSection'
import {
  AssignmentDetails,
  FullStructure,
  ReviewAction,
  ReviewSectionComponentProps,
} from '../../../utils/types'

// Component renders a line for review assignment within a section
// to be used in ReviewHome and Expansions
type ReviewSectionRowProps = {
  sectionId: number
  fullStructure: FullStructure
  reviewAssignment: AssignmentDetails
  previousAssignment: AssignmentDetails
}

const ReviewSectionRow: React.FC<ReviewSectionRowProps> = ({
  sectionId,
  fullStructure,
  reviewAssignment,
  previousAssignment,
}) => {
  const { strings } = useLanguageProvider()
  const { reviewStructuresState, setReviewStructureState } = useReviewStructureState()

  const shouldUpdate = Object.entries(reviewStructuresState).find(
    ([key, { loading }]) => Number(key) === reviewAssignment.id && loading
  )

  const { reviewStructure: reviewStructureForSections, error } = useGetReviewStructureForSections({
    reviewAssignment,
    reviewStructure: fullStructure,
    awaitMode: !shouldUpdate,
  })

  useEffect(() => {
    if (reviewStructureForSections && shouldUpdate) {
      setReviewStructureState({
        type: 'addAssignmentDetails',
        reviewStructure: reviewStructureForSections,
        assignment: reviewAssignment,
      })
    }
  }, [reviewStructureForSections])

  if (error) return <Message error title={strings.ERROR_GENERIC} list={[error]} />
  if (reviewStructuresState[reviewAssignment.id]?.loading) return <LoadingSmall />

  const reviewStructure = reviewStructuresState[reviewAssignment.id].review as FullStructure
  const section = reviewStructure.sortedSections?.find(
    (section) => section.details.id === sectionId
  )
  if (!reviewStructure || !section) return null

  const sectionCode = section?.details.code
  const assignmentId = reviewAssignment.id

  // TODO: Make sure this fields is correctly set considering assignedSections
  const isAssignedToCurrentUser = !!section?.assignment?.isAssignedToCurrentUser

  const props: ReviewSectionComponentProps = {
    reviewStructure,
    reviewAssignment,
    section,
    previousAssignment,
    action: section?.assignment?.action || ReviewAction.unknown,
    isConsolidation: section.assignment?.isConsolidation || false,
    isAssignedToCurrentUser,
  }

  // TODO: Needs to check this perviously - so it won't show
  // loading while waiting for ReviewAssignment which is not
  // for the current user
  const canRenderRow =
    section?.assignment?.isAssignedToCurrentUser ||
    section?.assignment?.action === ReviewAction.canMakeDecision ||
    section?.assignment?.isReviewable

  return (
    <div key={`section_${sectionCode}_assignment_${assignmentId}`}>
      {canRenderRow && (
        <Grid className="flex-row" verticalAlign="middle">
          <Grid.Row columns={4} className="reviewer-row">
            <ReviewSectionRowAssigned {...props} />
            <ReviewSectionRowLastActionDate {...props} />
            <ReviewSectionRowProgress {...props} />
            <ReviewSectionRowAction {...props} />
          </Grid.Row>
        </Grid>
      )}
    </div>
  )
}

export default ReviewSectionRow
