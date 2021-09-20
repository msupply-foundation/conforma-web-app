import React, { useState } from 'react'
import { Grid, Label } from 'semantic-ui-react'
import { useUserState } from '../../contexts/UserState'
import strings from '../../utils/constants'
import { AssignmentOption } from '../../utils/data/assignmentOptions'
import useUpdateReviewAssignment from '../../utils/hooks/useUpdateReviewAssignment'
import { AssignmentDetails, FullStructure } from '../../utils/types'
import AssigneeDropdown from './AssigneeDropdown'
import getAssignmentOptions from './getAssignmentOptions'
import Reassignment from './Reassignment'

type AssignmentSectionRowProps = {
  assignments: AssignmentDetails[]
  sectionCode: string
  structure: FullStructure
  shouldAssignState: [number | boolean, React.Dispatch<React.SetStateAction<number | boolean>>]
}
// Component renders options calculated in getAssignmentOptions, and will execute assignment mutation on drop down change
const AssignmentSectionRow: React.FC<AssignmentSectionRowProps> = (props) => {
  const { assignments, sectionCode, structure, shouldAssignState } = props
  const {
    userState: { currentUser },
  } = useUserState()
  const [isReassignment, setIsReassignment] = useState(false)
  const [assignmentError, setAssignmentError] = useState(false)
  const { assignSectionToUser } = useUpdateReviewAssignment(structure)
  const elements = Object.values(structure?.elementsById || {})

  const assignmentOptions = getAssignmentOptions(
    {
      assignments,
      sectionCode,
      elements,
    },
    currentUser
  )
  if (!assignmentOptions) return null

  const onAssignment = async (value: number) => {
    if (value === assignmentOptions.selected) return
    if (value === AssignmentOption.UNASSIGN) return console.log('un assignment not implemented')
    if (value === AssignmentOption.REASSIGN) setIsReassignment(true)

    const assignment = assignments.find((assignment) => assignment.reviewer.id === value)

    if (!assignment) return
    try {
      await assignSectionToUser({ assignment, sectionCode })
    } catch (e) {
      console.log(e)
      setAssignmentError(true)
    }
  }

  const isLastLevel = (selected: number): boolean => {
    const assignment = assignments.find((assignment) => assignment.reviewer.id === selected)
    if (!assignment) return false
    return assignment.isLastLevel
  }

  return (
    <Grid className="section-single-row-box-container">
      <Grid.Row>
        <Grid.Column className="centered-flex-box-row">
          <Label
            className="simple-label"
            content={isReassignment ? strings.LABEL_UNASSIGN_FROM : strings.LABEL_REVIEWER}
          />
          <AssigneeDropdown
            assignmentError={assignmentError}
            assignmentOptions={assignmentOptions}
            checkIsLastLevel={isLastLevel}
            onAssignment={onAssignment}
            shouldAssignState={shouldAssignState}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        {isReassignment && (
          <Reassignment
            assignments={assignments}
            sectionCode={sectionCode}
            elements={elements}
            isLastLevel={isLastLevel}
            shouldAssignState={shouldAssignState}
            previousAssignee={assignmentOptions.selected}
          />
        )}
      </Grid.Row>
    </Grid>
  )
}

export default AssignmentSectionRow
