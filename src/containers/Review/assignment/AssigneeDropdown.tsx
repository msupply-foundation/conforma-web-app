import React from 'react'
import { Dropdown } from 'semantic-ui-react'
interface AssigneeProps {
  assignmentOptions: {
    isCompleted: boolean
    selected: number
    options: {
      key: number
      value: number
      text: string
    }[]
  }
  sectionCode: string
  onChangeMethod: (selected: number) => void
}

const AssigneeDropdown: React.FC<AssigneeProps> = ({ assignmentOptions, onChangeMethod }) => {
  const { isCompleted, options, selected } = assignmentOptions

  return (
    <Dropdown
      className="reviewer-dropdown"
      options={options}
      value={selected}
      disabled={isCompleted}
      onChange={(_: any, { value }: any) => onChangeMethod(value as number)}
    />
  )
}

export default AssigneeDropdown
