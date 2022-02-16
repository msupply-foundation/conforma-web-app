import React, { SetStateAction } from 'react'
import { Container, Grid, Header, Segment } from 'semantic-ui-react'
import { useReviewStructureState } from '../../../contexts/ReviewStructuresState'
import {
  AssignmentDetails,
  FullStructure,
  LevelAssignments,
  SectionAssignee,
} from '../../../utils/types'
import AssignmentSectionRow from './AssignmentSectionRow'
import ReviewSectionRow from './ReviewSectionRow'

interface AssignmentRowsProps {
  fullStructure: FullStructure
  assignmentInPreviousStage: AssignmentDetails
  assignmentGroupedLevel: LevelAssignments
  assignedSections: SectionAssignee
  setAssignedSections: React.Dispatch<SetStateAction<SectionAssignee>>
  setEnableSubmit: React.Dispatch<SetStateAction<boolean>>
}
const AssignmentRows: React.FC<AssignmentRowsProps> = ({
  fullStructure,
  assignmentInPreviousStage,
  assignmentGroupedLevel,
  assignedSections,
  setAssignedSections,
  setEnableSubmit,
}) => {
  const {
    reviewStructuresState: { structures },
  } = useReviewStructureState()

  return (
    <>
      {Object.values(fullStructure.sections).map(({ details: { id, title, code } }) => (
        <Segment className="stripes" key={id}>
          <Header className="section-title" as="h5" content={title} />
          {Object.entries(assignmentGroupedLevel).map(([level, assignments]) => (
            <>
              <AssignmentSectionRow
                key={`assignment-row-section-${code}-level-${level}`}
                assignments={assignments}
                sectionCode={code}
                reviewLevel={Number(level)}
                structure={fullStructure}
                assignedSectionsState={[assignedSections, setAssignedSections]}
                setEnableSubmit={setEnableSubmit}
              />
              {(assignments as AssignmentDetails[]).map((assignment) =>
                structures[assignment.id] ? (
                  <ReviewSectionRow
                    key={`review-row-section-${code}-assignment-${assignment.id}`}
                    sectionId={id}
                    reviewStructure={structures[assignment.id]}
                    previousAssignment={assignmentInPreviousStage}
                  />
                ) : null
              )}
            </>
          ))}
        </Segment>
      ))}
    </>
  )
}

export default AssignmentRows
