import React, { useState } from 'react'
import { Label, Grid } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { AssignmentDetails, PageElement, SectionAssignee } from '../../../utils/types'
import AssigneeDropdown from './AssigneeDropdown'
import useGetAssignmentOptions from './useGetAssignmentOptions'

interface ReassignmentProps {
  assignments: AssignmentDetails[]
  sectionCode: string
  elements: PageElement[]
  isLastLevel: (selectedIndex: number) => boolean
  previousAssignee: number
  assignedSectionsState: [SectionAssignee, React.Dispatch<React.SetStateAction<SectionAssignee>>]
}

const Reassignment: React.FC<ReassignmentProps> = ({
  assignments,
  sectionCode,
  elements,
  isLastLevel,
  previousAssignee,
  assignedSectionsState,
}) => {
  const { strings } = useLanguageProvider()
  const getAssignmentOptions = useGetAssignmentOptions()
  const [reassignmentError, setReassignmentError] = useState(false)
  const [assignedSections, setAssignedSections] = assignedSectionsState
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
    // if (value === AssignmentEnum.UNASSIGN) return console.log('un assignment not implemented')

    const reassignment = assignments.find((assignment) => assignment.reviewer.id === value)

    if (!reassignment) return

    if (isLastLevel(value)) {
      let allSectionsToUserId: SectionAssignee = {}
      Object.keys(assignedSections).forEach(
        (sectionCode) =>
          (allSectionsToUserId[sectionCode] = { newAssignee: value as number, previousAssignee })
      )
      setAssignedSections(allSectionsToUserId)
    } else
      setAssignedSections({
        ...assignedSections,
        [sectionCode]: { newAssignee: value as number, previousAssignee },
      })
  }

  return (
    <Grid.Column className="centered-flex-box-row">
      <Label className="simple-label" content={strings.LABEL_REASSIGN_TO} />
      <AssigneeDropdown
        assignmentError={reassignmentError}
        assignmentOptions={assignmentOptions}
        sectionCode={sectionCode}
        checkIsLastLevel={isLastLevel}
        onSelection={onReassignment}
        assignedSectionsState={assignedSectionsState}
      />
    </Grid.Column>
  )
}

export default Reassignment
