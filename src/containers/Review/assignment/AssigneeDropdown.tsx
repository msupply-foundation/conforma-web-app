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
      text={
        options.find(({ value }) => value === selected)?.text || strings.ASSIGNMENT_NOT_ASSIGNED
      }
      disabled={isCompleted}
      labeled
      scrolling
    >
      <Dropdown.Menu>
        <Dropdown.Header icon="tags" content={strings.ASSIGNMENT_NOT_ASSIGNED} />
        <Dropdown.Divider />
        {options.map((assignee) => (
          <Dropdown.Item
            {...assignee}
            onClick={(_: any, { value }: any) => onChangeMethod(value as number)}
          />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default AssigneeDropdown
