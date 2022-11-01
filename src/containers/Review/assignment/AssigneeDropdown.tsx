import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
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

  const { strings } = useLanguageProvider()

  return (
    <Dropdown
      scrolling
      search
      className="reviewer-dropdown"
      text={strings.ASSIGNMENT_NOT_ASSIGNED}
      labeled
      value={selected}
      disabled={isCompleted}
      onChange={(_: any, { value }: any) => {
        console.log('onChange', value)
        onChangeMethod(value as number)
      }}
      options={options}
    />
  )
}

export default AssigneeDropdown
