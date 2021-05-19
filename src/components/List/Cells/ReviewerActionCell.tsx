import React from 'react'
import { Link } from 'react-router-dom'
import { CellProps } from '../../../utils/types'
import strings from '../../../utils/constants'
import { ReviewerAction } from '../../../utils/generated/graphql'

const ReviewerActionCell: React.FC<CellProps> = ({
  application: { serial, assignCount, reviewerAction, isFullyAssignedLevel1 },
}) => {
  const actions = []
  const notZero = (num: number | undefined) => num && Number(num) !== 0

  const getActionString = (reviewerAction: ReviewerAction) => {
    switch (reviewerAction) {
      case ReviewerAction.UpdateReview:
        return strings.ACTION_UPDATE
      case ReviewerAction.RestartReview:
        return strings.ACTION_RE_REVIEW
      case ReviewerAction.ContinueReview:
        return strings.ACTION_CONTINUE
      case ReviewerAction.StartReview:
        return strings.ACTION_START
      default:
        return strings.ACTION_VIEW
    }
  }

  if (!!reviewerAction) actions.push(getActionString(reviewerAction))

  if (notZero(assignCount) && isFullyAssignedLevel1) actions.push(strings.ACTION_RE_ASSIGN)

  if (notZero(assignCount) && !isFullyAssignedLevel1) actions.push(strings.ACTION_ASSIGN)

  return (
    <>
      {actions.map((action, index) => {
        return (
          <>
            {/* To-do: style the | once we can see it properly */}
            {index > 0 ? <span>{' | '}</span> : ''}
            <Link key={index} className="user-action" to={`/application/${serial}/review`}>
              {action}
            </Link>
          </>
        )
      })}
    </>
  )
}

export default ReviewerActionCell
