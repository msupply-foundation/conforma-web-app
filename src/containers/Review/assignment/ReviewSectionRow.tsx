import React from 'react'
import { Grid } from 'semantic-ui-react'
import {
  ReviewSectionRowAssigned,
  ReviewSectionRowLastActionDate,
  ReviewSectionRowProgress,
  ReviewSectionRowAction,
} from '../../../components/Review'
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
  previousAssignment: AssignmentDetails
  reviewStructure: FullStructure
  reviewAssignment: AssignmentDetails
}

const ReviewSectionRow: React.FC<ReviewSectionRowProps> = ({
  sectionId,
  previousAssignment,
  reviewStructure,
  reviewAssignment,
}) => {
  const section = reviewStructure.sortedSections?.find(
    (section) => section.details.id === sectionId
  )

  if (!section) return null

  const sectionCode = section?.details.code
  const assignmentId = reviewStructure.assignment?.assignmentId

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
