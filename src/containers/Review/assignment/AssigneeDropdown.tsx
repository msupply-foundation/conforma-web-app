import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { AssignmentOptions } from '../../../utils/types'
interface AssigneeProps {
  assignmentOptions: AssignmentOptions
  sectionCode: string
  onChangeMethod: (selected: number) => void
}

const AssigneeDropdown: React.FC<AssigneeProps> = ({ assignmentOptions, onChangeMethod }) => {
  const { strings } = useLanguageProvider()
  const { isCompleted, options, selected } = assignmentOptions

  return (
    <Dropdown
      className="reviewer-dropdown"
      placeholder={strings.ASSIGNMENT_NOT_ASSIGNED}
      options={options}
      value={selected}
      disabled={isCompleted}
      scrolling
      search
      onChange={(_: any, { value }: any) => onChangeMethod(value as number)}
    />
  )
}

export default AssigneeDropdown
