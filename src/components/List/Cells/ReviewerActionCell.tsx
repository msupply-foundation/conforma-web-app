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
        // We don't want to show "Re-assign" here, makes it too inviting to
        // change -- re-assigning should be an occasional task
        return null
      default:
        // AssignerAction.Assign
        return strings.ACTION_ASSIGN
    }
  }

  // Reviewer action takes priority, and only show if Application is PENDING
  const action =
    outcome === ApplicationOutcome.Pending
      ? !!reviewerAction
        ? getReviewActionString(reviewerAction)
        : !!assignerAction
        ? getAssignActionString(assignerAction)
        : null
      : null

  if (!action)
    return (
      <Link className="user-action" to={`/application/${serial}/review`}>
        <Icon name="chevron right" />
      </Link>
    )

  return (
    <div>
      <Link
        className="user-action"
        to={
          action === strings.ACTION_VIEW
            ? `/application/${serial}/review`
            : `/application/${serial}/review?tab=assignment`
        }
      >
        {action}
      </Link>
    </div>
  )
}

export default ReviewerActionCell
