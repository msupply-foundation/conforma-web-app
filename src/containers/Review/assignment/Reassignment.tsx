import React, { useState } from 'react'
import { Label, Grid } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { AssignmentEnum } from '../../../utils/data/assignmentOptions'
import { ReviewAssignmentStatus } from '../../../utils/generated/graphql'
import useReasignReviewAssignment from '../../../utils/hooks/useReassignReviewAssignment'
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
  const { reassignSection } = useReasignReviewAssignment()
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
    if (value === AssignmentEnum.UNASSIGN) return console.log('un assignment not implemented')

    const previousAssignment = assignments.find(
      ({ reviewer, current: { assignmentStatus } }) =>
        reviewer.id === previousAssignee && assignmentStatus === ReviewAssignmentStatus.Assigned
    )
    const reassignment = assignments.find((assignment) => assignment.reviewer.id === value)

    if (!reassignment) return

    if (isLastLevel(value)) {
      let allSectionsToUserId: SectionAssignee = {}
      Object.keys(assignedSections).forEach(
        (sectionCode) => (allSectionsToUserId[sectionCode] = value as number)
      )
      setAssignedSections(allSectionsToUserId)
    } else setAssignedSections({ ...assignedSections, [sectionCode]: value as number })
    // try {
    //   await reassignSection({
    //     unassignmentId: previousAssignment?.id,
    //     reassignment,
    //     sectionCode,
    //     elements,
    //   })
    // } catch (e) {
    //   console.error(e)
    //   setReassignmentError(true)
    // }
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
