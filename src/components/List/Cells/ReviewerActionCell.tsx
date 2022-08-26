import React from 'react'
import { Link } from 'react-router-dom'
import { CellProps } from '../../../utils/types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import {
  ApplicationOutcome,
  AssignerAction,
  ReviewerAction,
} from '../../../utils/generated/graphql'
import { Icon } from 'semantic-ui-react'

const ReviewerActionCell: React.FC<CellProps> = ({
  application: { serial, reviewerAction, assignerAction, outcome },
}) => {
  const { strings } = useLanguageProvider()
  const actions = []

  const getReviewActionString = (reviewerAction: ReviewerAction) => {
    switch (reviewerAction) {
      case ReviewerAction.SelfAssign:
        return strings.ACTION_SELF_ASSIGN
      case ReviewerAction.UpdateReview:
        return strings.ACTION_UPDATE
      case ReviewerAction.RestartReview:
        return strings.ACTION_RE_REVIEW
      case ReviewerAction.ContinueReview:
        return strings.ACTION_CONTINUE
      case ReviewerAction.StartReview:
        return strings.ACTION_START
      case ReviewerAction.MakeDecision:
        return strings.ACTION_MAKE_DECISION
      case ReviewerAction.AwaitingResponse:
        return strings.ACTION_AWAITING_RESPONSE
      default:
        // ReviewerAction.ViewReview
        return strings.ACTION_VIEW
    }
  }

  const getAssignActionString = (assignerAction: AssignerAction) => {
    switch (assignerAction) {
      case AssignerAction.ReAssign:
        return strings.ACTION_RE_ASSIGN
      default:
        // AssignerAction.Assign
        return strings.ACTION_ASSIGN
    }
  }

  // Only show actions if application is Pending - TODO: Change logic to back-end
  if (outcome === ApplicationOutcome.Pending) {
    if (!!reviewerAction) actions.push(getReviewActionString(reviewerAction))
    if (!!assignerAction && assignerAction != AssignerAction.AssignLocked)
      actions.push(getAssignActionString(assignerAction))
  }
  if (actions.length == 0)
    return (
      <Link className="user-action" to={`/application/${serial}/review`}>
        <Icon name="chevron right" />
      </Link>
    )

  return (
    <>
      {actions.map((action, index) => {
        const linkUrl =
          action === strings.ACTION_VIEW
            ? `/application/${serial}/review`
            : `/application/${serial}/review?tab=assignment`
        return (
          <div key={index}>
            {/* To-do: style the | once we can see it properly */}
            {index > 0 ? <span key={`divider_${index}`}>{' | '}</span> : ''}
            <Link className="user-action" to={linkUrl}>
              {action}
            </Link>
          </div>
        )
      })}
    </>
  )
}

export default ReviewerActionCell
