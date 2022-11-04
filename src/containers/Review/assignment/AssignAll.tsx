import React, { useState } from 'react'
import { Dropdown, Label } from 'semantic-ui-react'
import Tooltip from '../../../components/Tooltip'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { useUserState } from '../../../contexts/UserState'
import { AssignmentDetails, User } from '../../../utils/types'

interface AssignAllProps {
  assignments: AssignmentDetails[]
  setReviewerForAll: (value: number) => void
}

const AssignAll: React.FC<AssignAllProps> = ({ assignments, setReviewerForAll }) => {
  const {
    userState: { currentUser },
  } = useUserState()
  const { strings } = useLanguageProvider()
  const [selected, setSelected] = useState<number | string>('')
  const options = getReviewerList(
    assignments,
    currentUser?.userId || 0,
    strings.ASSIGNMENT_YOURSELF
  )

  // We only want to show when we're not in last level, as that auto-assigns
  // already
  const isLastLevel = assignments.length > 0 && assignments[0].isLastLevel

  if (isLastLevel || options.length === 0) return null

  return (
    <div className="flex-row-start-center" id="review-assign-all">
      <Label className="uppercase-label" content={strings.ASSIGN_ALL_TO} />
      <Dropdown
        className="reviewer-dropdown"
        text={
          options.find(({ value }) => value === selected)?.text || strings.ASSIGNMENT_NOT_ASSIGNED
        }
        scrolling
      >
        <Dropdown.Menu>
          <Dropdown.Header icon="tags" content={strings.ASSIGNMENT_NOT_ASSIGNED} />
          <Dropdown.Divider />
          {options.map((assignee) => (
            <Dropdown.Item
              {...assignee}
              onClick={(_, { value }) => {
                setReviewerForAll(value as number)
                setSelected(value as number | string)
              }}
            />
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <Tooltip
        message={strings.ASSIGN_ALL_TOOLTIP}
        maxWidth={400}
        iconStyle={{ height: '1.4em' }}
        triggerEvent="hover"
      />
    </div>
  )
}

const getReviewerList = (
  assignments: AssignmentDetails[],
  currentUserId: number,
  selfString: string
) => {
  const reviewers = assignments
    // We don't want to filter here, as when the back-end has "allowedSections =
    // null", it means "allow all". Worst case, if the reviewer really is
    // allowed "no sections" (which shouldn't happen), then they'll show up in
    // the menu, but still won't actually be able to be assigned
    // .filter((assignment) => assignment.allowedSections.length > 0)
    .map((assignment, index) => {
      const {
        reviewer: { id, firstName, lastName },
      } = assignment
      const displayName = id === currentUserId ? selfString : `${firstName} ${lastName}`
      const reviewer = {
        key: id,
        value: index,
        reviewerId: id,
        text: displayName,
      }
      return reviewer
    })
  return reviewers
}

export default AssignAll
