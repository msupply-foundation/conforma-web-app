import React from 'react'
import { Label, Grid } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { AssignmentDetails, SectionAssignee } from '../../../utils/types'
import AssigneeDropdown from './AssigneeDropdown'
import useGetAssignmentOptions from './useGetAssignmentOptions'

interface ReassignmentProps {
  assignments: AssignmentDetails[]
  sectionCode: string
  isLastLevel: (selectedIndex: number) => boolean
  previousAssignee: number
  assignedSectionsState: [SectionAssignee, (assignedSections: SectionAssignee) => void]
}

const Reassignment: React.FC<ReassignmentProps> = ({
  assignments,
  sectionCode,
  isLastLevel,
  previousAssignee,
  assignedSectionsState,
}) => {
  const { strings } = useLanguageProvider()
  const getAssignmentOptions = useGetAssignmentOptions()
  const [assignedSections, setAssignedSections] = assignedSectionsState
  const assignmentOptions = getAssignmentOptions({
    assignments,
    sectionCode,
    assignee: previousAssignee,
  })
  if (!assignmentOptions) return null

  const onReassignment = async (value: number) => {
    if (value === assignmentOptions.selected) return console.log('Re-assignment to same reviewer')

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
        assignmentOptions={assignmentOptions}
        sectionCode={sectionCode}
        onChangeMethod={(selected: number) => onReassignment(selected)}
      />
    </Grid.Column>
  )
}

export default Reassignment
