import React from 'react'
import { Button } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { useReviewStructureState } from '../../../contexts/ReviewStructuresState'
import useUpdateReviewAssignment from '../../../utils/hooks/useUpdateReviewAssignment'
import useReasignReviewAssignment from '../../../utils/hooks/useReassignReviewAssignment'
import { AssignmentDetails, FullStructure, SectionAssignee } from '../../../utils/types'

interface AssignmentSubmitProps {
  fullStructure: FullStructure
  assignedSections: SectionAssignee
  assignmentsFiltered: AssignmentDetails[]
  enableSubmit: boolean
}

const AssignmentSubmit: React.FC<AssignmentSubmitProps> = ({
  fullStructure,
  assignedSections,
  assignmentsFiltered,
  enableSubmit,
}) => {
  const { strings } = useLanguageProvider()
  const {
    reviewStructuresState: { structures },
  } = useReviewStructureState()
  const { assignSectionsToUser } = useUpdateReviewAssignment(fullStructure)
  const { reassignSections } = useReasignReviewAssignment(fullStructure)

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
      const unassignment = assignmentsFiltered.find(
        ({ reviewer: { id } }) => id === previousAssignee
      )

      if (found) {
        found.sectionCodes.push(sectionCode)
        if (!!unassignment && found?.unassignmentId != unassignment.id)
          console.log('Unassignment for more than one previous assignee - Failed')
      } else {
        const reassignment = assignmentsFiltered.find(({ reviewer: { id } }) => id === newAssignee)
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
        const assignment = assignmentsFiltered.find(({ reviewer: { id } }) => id === newAssignee)
        if (assignment) assignmentGroupedSections.push({ sectionCodes: [sectionCode], assignment })
      }
    })
    assignmentGroupedSections.forEach(({ sectionCodes, assignment }) => {
      assignSectionsToUser({
        sectionCodes,
        assignment,
        reviewStructure: structures[assignment.id],
      })
    })
  }

  return (
    <div style={{ marginTop: 10 }}>
      <Button
        primary
        content={strings.BUTTON_SUBMIT}
        compact
        onClick={submitAssignments}
        disabled={!enableSubmit}
      />
    </div>
  )
}

export default AssignmentSubmit
