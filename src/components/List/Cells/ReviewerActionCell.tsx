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
import { useRouter } from '../../../utils/hooks/useRouter'

const ReviewerActionCell: React.FC<CellProps> = ({
  application: { serial, reviewerAction, assignerAction, outcome },
}) => {
  const { t } = useLanguageProvider()
  const { location } = useRouter()

  const getReviewActionString = (reviewerAction: ReviewerAction) => {
    switch (reviewerAction) {
      case ReviewerAction.SelfAssign:
        return t('ACTION_SELF_ASSIGN')
      case ReviewerAction.UpdateReview:
        return t('ACTION_UPDATE')
      case ReviewerAction.RestartReview:
        return t('ACTION_RE_REVIEW')
      case ReviewerAction.ContinueReview:
        return t('ACTION_CONTINUE')
      case ReviewerAction.StartReview:
        return t('ACTION_START')
      case ReviewerAction.MakeDecision:
        return t('ACTION_MAKE_DECISION')
      case ReviewerAction.AwaitingResponse:
        return t('ACTION_AWAITING_RESPONSE')
      default:
        // ReviewerAction.ViewReview
        return t('ACTION_VIEW')
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
        return t('ACTION_ASSIGN')
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

  const actionLink = {
    pathname: `/application/${serial}/review`,
    state: { prevQuery: location?.search },
  }

  if (!action)
    return (
      <Link className="user-action" to={actionLink}>
        <Icon name="chevron right" />
      </Link>
    )

  return (
    <div>
      <Link
        className="user-action"
        to={action === t('ACTION_VIEW') ? actionLink : { ...actionLink, search: '?tab=assignment' }}
      >
        {action}
      </Link>
    </div>
  )
}

export default ReviewerActionCell
