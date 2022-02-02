import React, { useState } from 'react'
import { Label, Grid } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { AssignmentEnum } from '../../../utils/data/assignmentOptions'
import useReasignReviewAssignment from '../../../utils/hooks/useReassignReviewAssignment'
import { AssignmentDetails, PageElement } from '../../../utils/types'
import AssigneeDropdown from './AssigneeDropdown'
import useGetAssignmentOptions from './useGetAssignmentOptions'

interface ReassignmentProps {
  assignments: AssignmentDetails[]
  sectionCode: string
  elements: PageElement[]
  isLastLevel: (selectedIndex: number) => boolean
  shouldAssignState: [number, React.Dispatch<React.SetStateAction<number>>]
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
  const { strings } = useLanguageProvider()
  const getAssignmentOptions = useGetAssignmentOptions()
  const [reassignmentError, setReassignmentError] = useState(false)
  const { reassignSection } = useReasignReviewAssignment()

  const assignmentOptions = getAssignmentOptions(
    {
      assignments,
      sectionCode,
      elements,
      assignee: previousAssignee,
    },
    null
  )
  if (!assignmentOptions) return null

  const onReassignment = async (value: number) => {
    if (value === assignmentOptions.selected) return console.log('Re-assignment to same reviewer')
    if (value === AssignmentEnum.UNASSIGN) return console.log('un assignment not implemented')

    const previousAssignment = assignments.find(
      (assignment) => assignment.reviewer.id === previousAssignee
    )
    const reassignment = assignments.find((assignment) => assignment.reviewer.id === value)

    if (!reassignment) return
    try {
      await reassignSection({
        unassignmentId: previousAssignment?.id,
        reassignment,
        sectionCode,
        elements,
      })
    } catch (e) {
      console.error(e)
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
        onSelection={onReassignment}
        shouldAssignState={shouldAssignState}
      />
    </Grid.Column>
  )
}

export default Reassignment
