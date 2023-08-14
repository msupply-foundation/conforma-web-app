import React from 'react'
import { Label, Grid } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { AssignmentOptions, SectionAssignee } from '../../../utils/types'
import AssigneeDropdown from './AssigneeDropdown'

interface ReassignmentProps {
  sectionCode: string
  isLastLevel: boolean
  assignedSections: SectionAssignee
  setAssignedSections: (assignedSections: SectionAssignee) => void
  assignmentOptions: AssignmentOptions
}

const Reassignment: React.FC<ReassignmentProps> = ({
  sectionCode,
  isLastLevel,
  assignedSections,
  setAssignedSections,
  assignmentOptions,
}) => {
  const { t } = useLanguageProvider()

  const onReassignment = async (value: number) => {
    const { selected } = assignmentOptions
    if (value === assignmentOptions.selected) return console.log('Re-assignment to same reviewer')

    if (isLastLevel) {
      let allSectionsToUserId: SectionAssignee = {}

      Object.keys(assignedSections).forEach(
        (sectionCode) =>
          (allSectionsToUserId[sectionCode] = {
            newAssignee: value as number,
            previousAssignee: selected,
          })
      )

      setAssignedSections(allSectionsToUserId)
    } else
      setAssignedSections({
        ...assignedSections,
        [sectionCode]: { newAssignee: value as number, previousAssignee: selected },
      })
  }

  return (
    <Grid.Column className="centered-flex-box-row">
      <Label className="simple-label" content={t('LABEL_REASSIGN_TO')} />
      <AssigneeDropdown
        assignmentOptions={assignmentOptions}
        sectionCode={sectionCode}
        onChangeMethod={(selected: number) => onReassignment(selected)}
      />
    </Grid.Column>
  )
}

export default Reassignment
