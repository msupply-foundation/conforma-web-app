import React, { useEffect } from 'react'
import { Dropdown, Message } from 'semantic-ui-react'
import { useLanguageProvider } from '../../contexts/Localisation'

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
  onAssignment: (assignee: number) => void
  shouldAssignState: [number, React.Dispatch<React.SetStateAction<number>>]
}

const AssigneeDropdown: React.FC<AssigneeProps> = ({
  assignmentError,
  assignmentOptions,
  checkIsLastLevel,
  onAssignment,
  shouldAssignState: [shouldAssign, setShouldAssign],
}) => {
  const { strings } = useLanguageProvider()
  // Do auto-assign for other sections when assignee is selected
  // for assignment in another row when shouldAssign == assignee index
  // Note: This is required to be passed on as props to be processed
  // in each row since the fullStructure is related to each section
  useEffect(() => {
    // Option -1 (UNASSIGNED) or -2 (Re-assign) shouldn't change others
    if (shouldAssign < 1) return
    onAssignment(shouldAssign)
  }, [shouldAssign])

  const onAssigneeSelection = async (_: any, { value }: any) => {
    onAssignment(value as number)
    // When review isLastLevel then all sections are assigned to same user (similar to consolidation)
    if (checkIsLastLevel(value)) setShouldAssign(value as number)
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
