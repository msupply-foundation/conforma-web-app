import React from 'react'
import { Dropdown, Message } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { SectionAssignee } from '../../../utils/types'
interface AssigneeProps {
  assignmentError: boolean
  assignmentOptions: {
    isCompleted: boolean
    selected: number
    options: {
      key: number
      value: number
      text: string
    }[]
  }
  checkIsLastLevel: (assignee: number) => boolean
  onSelection: (assignee: number) => void
  assignedSectionsState: [SectionAssignee, React.Dispatch<React.SetStateAction<SectionAssignee>>]
}

const AssigneeDropdown: React.FC<AssigneeProps> = ({
  assignmentError,
  assignmentOptions,
  checkIsLastLevel,
  onSelection,
  assignedSectionsState: [assignedSections, setAssignedSections],
}) => {
  const { strings } = useLanguageProvider()

  const onAssigneeSelection = async (_: any, { value }: any) => {
    onSelection(value as number)
    // When review isLastLevel then all sections are assigned to same user (similar to consolidation)
    if (checkIsLastLevel(value)) {
      let allSectionsToUserId: SectionAssignee = {}
      Object.keys(assignedSections).forEach(
        (sectionCode) => (allSectionsToUserId[sectionCode] = value as number)
      )
      setAssignedSections(allSectionsToUserId)
    }
  }

  const { isCompleted, options, selected } = assignmentOptions

  if (assignmentError) return <Message error title={strings.ERROR_GENERIC} />
  return (
    <Dropdown
      className="reviewer-dropdown"
      options={options}
      value={selected}
      disabled={isCompleted}
      onChange={onAssigneeSelection}
    />
  )
}

export default AssigneeDropdown
