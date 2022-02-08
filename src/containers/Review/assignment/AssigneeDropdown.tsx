import React from 'react'
import { Dropdown, Message } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
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
  sectionCode: string
  onChangeMethod: (selected: number) => void
}

const AssigneeDropdown: React.FC<AssigneeProps> = ({
  assignmentError,
  assignmentOptions,
  onChangeMethod,
}) => {
  const { strings } = useLanguageProvider()

  const { isCompleted, options, selected } = assignmentOptions

  if (assignmentError) return <Message error title={strings.ERROR_GENERIC} />
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
