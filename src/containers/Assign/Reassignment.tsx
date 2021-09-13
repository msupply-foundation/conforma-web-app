import React, { useState } from 'react'
import { Label, Grid } from 'semantic-ui-react'
import strings from '../../utils/constants'
import { AssignmentOption } from '../../utils/data/assignmentOptions'
import useReasignReviewAssignment from '../../utils/hooks/useReassignReviewAssignment'
import { AssignmentDetails, PageElement } from '../../utils/types'
import AssigneeDropdown from './AssigneeDropdown'
import getAssignmentOptions from './getAssignmentOptions'

interface ReassignmentProps {
  assignments: AssignmentDetails[]
  sectionCode: string
  elements: PageElement[]
  isLastLevel: (selectedIndex: number) => boolean
  shouldAssignState: [number | boolean, React.Dispatch<React.SetStateAction<number | boolean>>]
  previousAssignee: number
}

const Reassignment: React.FC<ReassignmentProps> = ({
  assignments,
  sectionCode,
  elements,
  isLastLevel,
  shouldAssignState,
  previousAssignee,
}) => {
  const [reassignmentError, setReassignmentError] = useState(false)
  const { reassignSection } = useReasignReviewAssignment()

  const assignmentOptions = getAssignmentOptions({
    assignments,
    sectionCode,
    elements,
    previousAssignee,
  })
  if (!assignmentOptions) return null

  const onReassignment = async (value: number) => {
    if (value === assignmentOptions.selected) return console.log('Re-assignment to same reviewer')
    if (value === AssignmentOption.UNASSIGN) return console.log('un assignment not implemented')

    const previousAssigmnet = assignments.find(
      (assignment) => assignment.reviewer.id === previousAssignee
    )
    const reassignment = assignments.find((assignment) => assignment.reviewer.id === value)

    console.log('assignment', reassignment)

    if (!reassignment) return
    try {
      await reassignSection({
        unassignmentId: previousAssigmnet?.id,
        reassignment,
        sectionCode,
        elements,
      })
    } catch (e) {
      console.log(e)
      setReassignmentError(true)
    }
  }

  return (
    <Grid.Column className="centered-flex-box-row">
      <Label className="simple-label" content={strings.LABEL_REASSIGN_TO} />
      <AssigneeDropdown
        assignmentError={reassignmentError}
        assignmentOptions={assignmentOptions}
        checkIsLastLevel={isLastLevel}
        onAssignment={onReassignment}
        shouldAssignState={shouldAssignState}
      />
    </Grid.Column>
  )
}

export default Reassignment
