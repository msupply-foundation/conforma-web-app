import React from 'react'
import { Dropdown, Label } from 'semantic-ui-react'
import { AssignmentDetails } from '../../../utils/types'

interface AssignAllProps {
  assignments: AssignmentDetails[]
  setReviewerForAll: (value: number) => void
}

const AssignAll: React.FC<AssignAllProps> = ({ assignments, setReviewerForAll }) => {
  return (
    <div className="flex-row-start-center" id="review-assign-all">
      <Label className="uppercase-label" content="Assign all to:" />
      <Dropdown
        className="reviewer-dropdown"
        options={getReviewerList(assignments)}
        placeholder="Select..."
        onChange={(_, e) => setReviewerForAll(e.value as number)}
      />
    </div>
  )
}

const getReviewerList = (assignments: AssignmentDetails[]) => {
  return assignments
    .filter((assignment) => assignment.allowedSections.length > 0)
    .map((assignment) => ({
      key: assignment.reviewer.id,
      value: assignment.reviewer.id,
      text: `${assignment.reviewer.firstName} ${assignment.reviewer.lastName}`,
    }))
}

export default AssignAll
