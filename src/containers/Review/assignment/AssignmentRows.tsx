import React, { SetStateAction } from 'react'
import { Header, Segment } from 'semantic-ui-react'
import { useReviewStructureState } from '../../../contexts/ReviewStructuresState'
import { ApplicationOutcome } from '../../../utils/generated/graphql'
import {
  AssignedSectionsByLevel,
  AssignmentDetails,
  FullStructure,
  LevelAssignments,
} from '../../../utils/types'
import AssignmentSectionRow from './AssignmentSectionRow'
import ReviewSectionRow from './ReviewSectionRow'

interface AssignmentRowsProps {
  fullStructure: FullStructure
  assignmentInPreviousStage: AssignmentDetails
  assignmentGroupedLevel: LevelAssignments
  assignedSectionsByLevel: AssignedSectionsByLevel
  setAssignedSectionsByLevel: React.Dispatch<SetStateAction<AssignedSectionsByLevel>>
  setEnableSubmit: React.Dispatch<SetStateAction<boolean>>
  setAssignmentError: React.Dispatch<SetStateAction<string | null>>
}
const AssignmentRows: React.FC<AssignmentRowsProps> = ({
  fullStructure,
  assignmentInPreviousStage,
  assignmentGroupedLevel,
  assignedSectionsByLevel,
  setAssignedSectionsByLevel,
  setEnableSubmit,
  setAssignmentError,
}) => {
  const { reviewStructuresState } = useReviewStructureState()

  const defaultAssignedSections = Object.values(fullStructure.sections).reduce(
    (assignedSections, { details: { code } }) => ({
      ...assignedSections,
      [code]: { newAssignee: undefined },
    }),
    {}
  )

  return (
    <>
      {Object.values(fullStructure.sections).map(({ details: { id, title, code } }) => (
        <Segment key={id}>
          <Header className="section-title" as="h5" content={title} />
          {Object.entries(assignmentGroupedLevel).map(([level, assignments]) => (
            <div className="flex-column" key={`assignment-group-level-${level}`}>
              {fullStructure.info.outcome === ApplicationOutcome.Pending && (
                <AssignmentSectionRow
                  assignments={assignments}
                  sectionCode={code}
                  reviewLevel={Number(level)}
                  structure={fullStructure}
                  assignedSections={assignedSectionsByLevel[level] || defaultAssignedSections}
                  setAssignedSections={(assignedSections) =>
                    setAssignedSectionsByLevel({
                      ...assignedSectionsByLevel,
                      [level]: assignedSections,
                    })
                  }
                  setEnableSubmit={setEnableSubmit}
                  setAssignmentError={setAssignmentError}
                />
              )}
              {(assignments as AssignmentDetails[]).map((assignment) =>
                reviewStructuresState[assignment.id] && assignment.isCurrentUserReviewer ? (
                  <ReviewSectionRow
                    key={`review-row-section-${code}-assignment-${assignment.id}`}
                    sectionId={id}
                    fullStructure={fullStructure}
                    reviewAssignment={assignment}
                    previousAssignment={assignmentInPreviousStage}
                  />
                ) : null
              )}
            </div>
          ))}
        </Segment>
      ))}
    </>
  )
}

export default AssignmentRows
