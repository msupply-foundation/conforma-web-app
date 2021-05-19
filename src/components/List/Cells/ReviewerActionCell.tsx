import React, { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { CellProps } from '../../../utils/types'
import strings from '../../../utils/constants'

const ReviewerActionCell: React.FC<CellProps> = ({
  application: {
    reviewAssignedNotStartedCount,
    reviewAssignedCount,
    reviewDraftCount,
    reviewPendingCount,
    reviewSubmittedCount,
    reviewAvailableForSelfAssignmentCount,
    serial,
    assignCount,
    isFullyAssignedLevel1,
  },
}) => {
  const actions = []
  const notZero = (num: number | undefined) => num && Number(num) !== 0
  let canShowView = notZero(reviewAssignedCount) || notZero(reviewSubmittedCount)
  let canShowStart = notZero(reviewAssignedNotStartedCount)

  if (notZero(reviewPendingCount)) {
    canShowView = canShowStart = false
    actions.push(strings.ACTION_RE_REVIEW)
  }

  if (notZero(reviewDraftCount)) {
    canShowView = false
    actions.push(strings.ACTION_CONTINUE)
  }

  if (notZero(reviewAvailableForSelfAssignmentCount)) {
    canShowView = false
    actions.push(strings.ACTION_SELF_ASSIGN)
  }

  if (notZero(assignCount) && isFullyAssignedLevel1) {
    canShowView = false
    actions.push(strings.ACTION_RE_ASSIGN)
  }

  if (notZero(assignCount) && !isFullyAssignedLevel1) {
    canShowView = false
    actions.push(strings.ACTION_ASSIGN)
  }

  if (canShowStart) actions.push(strings.ACTION_START)
  else if (canShowView) actions.push(strings.ACTION_VIEW)

  return (
    <>
      {actions.map((action, index) => {
        return (
          <React.Fragment key={index}>
            {/* To-do: style the | once we can see it properly */}
            {index > 0 ? <span>{' | '}</span> : ''}
            <Link className="user-action" to={`/application/${serial}/review`}>
              {action}
            </Link>
          </React.Fragment>
        )
      })}
    </>
  )
}

export default ReviewerActionCell
