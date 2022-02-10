import React, { useState } from 'react'
import { Button, Segment, Header } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import useUpdateReviewAssignment from '../../../utils/hooks/useUpdateReviewAssignment'
import useReasignReviewAssignment from '../../../utils/hooks/useReassignReviewAssignment'
import { AssignmentDetails, Filters, FullStructure, SectionAssignee } from '../../../utils/types'
import AssignmentSectionRow from './AssignmentSectionRow'
import ReviewSectionRow from './ReviewSectionRow'

interface ReviewHomeProps {
  filters: Filters | null
  assignmentsByStageAndLevel: AssignmentDetails[]
  assignmentInPreviousStage: AssignmentDetails
  fullApplicationStructure: FullStructure
}

const Assignment: React.FC<ReviewHomeProps> = ({
  assignmentsByStageAndLevel,
  assignmentInPreviousStage,
  fullApplicationStructure,
}) => {
  const { strings } = useLanguageProvider()
  const { assignSectionsToUser } = useUpdateReviewAssignment(fullApplicationStructure)
  const { reassignSections } = useReasignReviewAssignment(fullApplicationStructure)
  const [enableSubmit, setEnableSubmit] = useState<boolean>(false)
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
      ([_, { previousAssignee }]) => !!previousAssignee
    )

    reassignedSections.forEach(([sectionCode, sectionAssignee]) => {
      const { newAssignee, previousAssignee } = sectionAssignee
      const found = reassignmentGroupedSections.find(
        ({
          reassignment: {
            reviewer: { id },
          },
        }) => id === newAssignee
      )
      const unassignment = assignmentsByStageAndLevel.find(
        ({ reviewer: { id } }) => id === previousAssignee
      )

      if (found) {
        found.sectionCodes.push(sectionCode)
        if (!!unassignment && found?.unassignmentId != unassignment.id)
          console.log('Unassignment for more than one previous assignee - Failed')
      } else {
        const reassignment = assignmentsByStageAndLevel.find(
          ({ reviewer: { id } }) => id === newAssignee
        )
        if (reassignment && unassignment)
          reassignmentGroupedSections.push({
            sectionCodes: [sectionCode],
            reassignment,
            unassignmentId: unassignment.id,
          })
      }
    })
    reassignmentGroupedSections.forEach(({ sectionCodes, reassignment, unassignmentId }) =>
      reassignSections({ sectionCodes, reassignment, unassignmentId })
    )

    // First assignment - grouping sections that belong to same assignment
    let assignmentGroupedSections: {
      sectionCodes: string[]
      assignment: AssignmentDetails
    }[] = []

    const firstAssignedSections = Object.entries(assignedSections).filter(
      ([_, { previousAssignee }]) => previousAssignee === undefined
    )

    firstAssignedSections.forEach(([sectionCode, { newAssignee }]) => {
      const found = assignmentGroupedSections.find(
        ({
          assignment: {
            reviewer: { id },
          },
        }) => id === newAssignee
      )
      if (found) found.sectionCodes.push(sectionCode)
      else {
        const assignment = assignmentsByStageAndLevel.find(
          ({ reviewer: { id } }) => id === newAssignee
        )
        if (assignment) assignmentGroupedSections.push({ sectionCodes: [sectionCode], assignment })
      }
    })
    assignmentGroupedSections.forEach(({ sectionCodes, assignment }) =>
      assignSectionsToUser({ sectionCodes, assignment })
    )
  }

  const assignmentGroupedLevel: { [level: number]: AssignmentDetails[] } = {}
  assignmentsByStageAndLevel.forEach((assignment) => {
    const { level } = assignment
    if (!assignmentGroupedLevel[level]) assignmentGroupedLevel[level] = [assignment]
    else assignmentGroupedLevel[level].push(assignment)
  })

  return (
    <>
      {Object.values(fullApplicationStructure.sections).map(({ details: { id, title, code } }) => (
        <Segment className="stripes" key={id}>
          <Header className="section-title" as="h5" content={title} />
          {Object.entries(assignmentGroupedLevel).map(([level, assignments]) => (
            <AssignmentSectionRow
              {...{
                assignments: assignments,
                sectionCode: code,
                reviewLevel: Number(level),
                structure: fullApplicationStructure,
                assignedSectionsState: [assignedSections, setAssignedSections],
                setEnableSubmit,
              }}
            />
          ))}
          {assignmentsByStageAndLevel.map((assignment) => (
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
        <Button
          primary
          content={strings.BUTTON_SUBMIT}
          compact
          onClick={submitAssignments}
          disabled={!enableSubmit}
        />
      </div>
    </>
  )
}

export default Assignment
