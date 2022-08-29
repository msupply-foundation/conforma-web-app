import React, { useState } from 'react'
import { Dropdown, Label } from 'semantic-ui-react'
import Tooltip from '../../../components/Tooltip'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { AssignmentDetails } from '../../../utils/types'

interface AssignAllProps {
  assignments: AssignmentDetails[]
  setReviewerForAll: (value: number) => void
}

const AssignAll: React.FC<AssignAllProps> = ({ assignments, setReviewerForAll }) => {
  const { strings } = useLanguageProvider()
  const [selected, setSelected] = useState<number | string>('')
  const options = getReviewerList(assignments)

  // We only want to show when we're not in last level, as that auto-assigns
  // already
  const isLastLevel = assignments.length > 0 && assignments[0].isLastLevel

  if (isLastLevel || options.length === 0) return null

  return (
    <div className="flex-row-start-center" id="review-assign-all">
      <Label className="uppercase-label" content={strings.ASSIGN_ALL_TO} />
      <Dropdown
        className="reviewer-dropdown"
        options={options}
        placeholder={strings.ASSIGN_ALL_PLACEHOLDER}
        value={selected}
        clearable
        onChange={(_, { value }) => {
          const reviewerId = value !== '' ? options[value as number].reviewerId : 0
          setReviewerForAll(reviewerId)
          setSelected(value as number | string)
        }}
      />
      <Tooltip
        message={strings.ASSIGN_ALL_TOOLTIP}
        maxWidth={400}
        iconStyle={{ height: '1.4em' }}
        triggerEvent="hover"
      />
    </div>
  )
}

const getReviewerList = (assignments: AssignmentDetails[]) => {
  const reviewers = assignments
    .filter((assignment) => assignment.allowedSections.length > 0)
    .map((assignment, index) => {
      const {
        reviewer: { id, firstName, lastName },
      } = assignment
      const reviewer = {
        key: id,
        value: index,
        reviewerId: id,
        text: `${firstName} ${lastName}`,
      }
      return reviewer
    })
  return reviewers
}

export default AssignAll
