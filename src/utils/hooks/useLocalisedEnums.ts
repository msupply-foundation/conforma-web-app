import { useLanguageProvider } from '../../contexts/Localisation'
import {
  ApplicationOutcome,
  ApplicationStatus,
  AssignerAction,
  ReviewerAction,
  Decision,
  ReviewResponseDecision,
} from '../generated/graphql'

/*
For converting enum names from database/server (Outcomes, Statuses, etc. to
localisable string references)
*/

const useLocalisedEnums = () => {
  const { strings } = useLanguageProvider()

  const AssignAction: { [key in AssignerAction]: string } = {
    ASSIGN: strings.ACTION_ASSIGN,
    ASSIGN_LOCKED: strings.ACTION_LOCKED,
    RE_ASSIGN: strings.ACTION_RE_ASSIGN,
  }

  const Status: { [key in ApplicationStatus]: string } = {
    DRAFT: strings.STATUS_DRAFT,
    SUBMITTED: strings.STATUS_SUBMITTED,
    CHANGES_REQUIRED: strings.STATUS_CHANGES_REQUIRED,
    RE_SUBMITTED: strings.STATUS_RE_SUBMITTED,
    COMPLETED: strings.STATUS_COMPLETED,
  }
  const Outcome: { [key in ApplicationOutcome]: string } = {
    PENDING: strings.OUTCOME_PENDING,
    APPROVED: strings.OUTCOME_APPROVED,
    REJECTED: strings.OUTCOME_REJECTED,
    EXPIRED: strings.OUTCOME_EXPIRED,
    WITHDRAWN: strings.OUTCOME_WITHDRAWN,
  }

  const Decision: {
    [key in Decision]: string
  } = {
    LIST_OF_QUESTIONS: strings.DECISION_LIST_OF_QUESTIONS,
    CHANGES_REQUESTED: strings.DECISION_CHANGES_REQUESTED,
    CONFORM: strings.DECISION_CONFORM,
    NON_CONFORM: strings.DECISION_NON_CONFORM,
    NO_DECISION: strings.DECISION_NO_DECISION,
  }

  const ReviewAction: { [key in ReviewerAction]: string } = {
    SELF_ASSIGN: strings.ACTION_SELF_ASSIGN,
    START_REVIEW: strings.ACTION_START,
    VIEW_REVIEW: strings.ACTION_VIEW,
    CONTINUE_REVIEW: strings.ACTION_CONTINUE,
    RESTART_REVIEW: strings.ACTION_PENDING,
    MAKE_DECISION: strings.ACTION_MAKE_DECISION,
    UPDATE_REVIEW: strings.ACTION_UPDATE,
    AWAITING_RESPONSE: strings.ACTION_AWAITING_RESPONSE,
  }

  const ReviewResponse: { [key in ReviewResponseDecision]: string } = {
    APPROVE: strings.LABEL_REVIEW_APPROVED,
    DECLINE: strings.LABEL_REVIEW_DECLINED,
    AGREE: strings.LABEL_CONSOLIDATION_AGREEMENT,
    DISAGREE: strings.LABEL_CONSOLIDATION_DISAGREEMENT,
  }

  return { AssignAction, Status, Outcome, Decision, ReviewAction, ReviewResponse }
}

export default useLocalisedEnums
