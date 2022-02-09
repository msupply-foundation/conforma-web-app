import React from 'react'
import { Label } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'

interface AssigneeLabelProps {
  assignee: string
  isSelfAssigned: boolean
  isReassignment: boolean
  setIsReassignment: React.Dispatch<React.SetStateAction<boolean>>
  setIsUnassignment: () => void
}

const AssigneeLabel: React.FC<AssigneeLabelProps> = ({
  assignee,
  isSelfAssigned,
  isReassignment,
  setIsReassignment,
  setIsUnassignment,
}) => {
  const { strings } = useLanguageProvider()
  return (
    <>
      <Label
        className="simple-label"
        content={`${
          isReassignment ? strings.LABEL_UNASSIGN_FROM : strings.LABEL_REVIEWER
        }: ${assignee}`}
      />
      {!isReassignment && !isSelfAssigned && (
        <>
          <a className="user-action clickable" onClick={() => setIsReassignment(true)}>
            {strings.ACTION_RE_ASSIGN}
          </a>
          <span>{' | '}</span>
        </>
      )}
      <a className="user-action clickable" onClick={setIsUnassignment}>
        {strings.ACTION_UNASSIGN}
      </a>
    </>
  )
}

export default AssigneeLabel
