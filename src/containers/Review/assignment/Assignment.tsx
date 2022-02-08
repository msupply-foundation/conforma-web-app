import React, { useState } from 'react'
import { Button, Segment, Header } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import useUpdateReviewAssignment from '../../../utils/hooks/useUpdateReviewAssignment'
import useReasignReviewAssignment from '../../../utils/hooks/useReassignReviewAssignment'
import { AssignmentDetails, FullStructure, SectionAssignee } from '../../../utils/types'
import AssignmentSectionRow from './AssignmentSectionRow'
import ReviewSectionRow from './ReviewSectionRow'

interface ReviewHomeProps {
  assignmentsByStage: AssignmentDetails[]
  assignmentsByUserAndStage: AssignmentDetails[]
  assignmentInPreviousStage: AssignmentDetails
  fullApplicationStructure: FullStructure
}

const Assignment: React.FC<ReviewHomeProps> = ({
  assignmentsByStage,
  assignmentsByUserAndStage,
  assignmentInPreviousStage,
  fullApplicationStructure,
}) => {
  const { strings } = useLanguageProvider()
  const { assignSectionsToUser } = useUpdateReviewAssignment(fullApplicationStructure)
  const { reassignSections } = useReasignReviewAssignment(fullApplicationStructure)
  const [assignedSections, setAssignedSections] = useState<SectionAssignee>(
    Object.values(fullApplicationStructure.sections).reduce(
      (assignedSections, { details: { code } }) => ({
        ...assignedSections,
        [code]: { newAssignee: undefined },
      }),
      {}
    )
  )

  const submitAssignments = () => {
    // Re-assignment - grouping sections that belong to same (new) assignment
    let reassignmentGroupedSections: {
      sectionCodes: string[]
      unassignmentId: number
      reassignment: AssignmentDetails
    }[] = []

    const reassignedSections = Object.entries(assignedSections).filter(
      ([sectionCode, { previousAssignee }]) => !!previousAssignee
    )

    reassignedSections.forEach(([sectionCode, sectionAssignee]) => {
      const { newAssignee, previousAssignee } = sectionAssignee
      const found = reassignmentGroupedSections.find(
        ({ reassignment: { reviewerId } }) => reviewerId === newAssignee
      )
      if (found) {
        found.sectionCodes.push(sectionCode)
        if (!!previousAssignee && found?.unassignmentId != previousAssignee)
          console.log('Unassignment for more than one previous assignee - Failed')
      } else {
        const reassignment = assignmentsByStage.find(({ reviewer: { id } }) => id === newAssignee)
        if (reassignment && !!previousAssignee)
          reassignmentGroupedSections.push({
            sectionCodes: [sectionCode],
            reassignment,
            unassignmentId: previousAssignee,
          })
      }
    })
    reassignmentGroupedSections.forEach(({ sectionCodes, reassignment, unassignmentId }) =>
      reassignSections({ sectionCodes, reassignment, unassignmentId })
    )

    console.log('Reassignments', reassignmentGroupedSections)

    // First assignment - grouping sections that belong to same assignment
    let assignmentGroupedSections: {
      sectionCodes: string[]
      assignment: AssignmentDetails
    }[] = []

    const firstAssignedSections = Object.entries(assignedSections).filter(
      ([sectionCode, { previousAssignee }]) => previousAssignee === undefined
    )

    firstAssignedSections.forEach(([sectionCode, { newAssignee }]) => {
      const found = assignmentGroupedSections.find(
        ({ assignment: { reviewerId } }) => reviewerId === newAssignee
      )
      if (found) found.sectionCodes.push(sectionCode)
      else {
        const assignment = assignmentsByStage.find(({ reviewer: { id } }) => id === newAssignee)
        if (assignment) assignmentGroupedSections.push({ sectionCodes: [sectionCode], assignment })
      }
    })
    assignmentGroupedSections.forEach(({ sectionCodes, assignment }) =>
      assignSectionsToUser({ sectionCodes, assignment })
    )

    console.log('assignments', assignmentGroupedSections)
  }

  return (
    <>
      {Object.values(fullApplicationStructure.sections).map(({ details: { id, title, code } }) => (
        <Segment className="stripes" key={id}>
          <Header className="section-title" as="h5" content={title} />
          <AssignmentSectionRow
            {...{
              assignments: assignmentsByStage,
              structure: fullApplicationStructure,
              sectionCode: code,
              assignedSectionsState: [assignedSections, setAssignedSections],
            }}
          />
          {assignmentsByUserAndStage.map((assignment) => (
            <ReviewSectionRow
              {...{
                key: assignment.id,
                sectionId: id,
                assignment,
                fullApplicationStructure,
                previousAssignment: assignmentInPreviousStage,
              }}
            />
          ))}
        </Segment>
      ))}
      <div style={{ marginTop: 10 }}>
        <Button primary content={strings.BUTTON_SUBMIT} compact onClick={submitAssignments} />
      </div>
    </>
  )
}

export default Assignment
