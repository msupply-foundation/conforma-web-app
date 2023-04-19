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
  const { t } = useLanguageProvider()

  const AssignAction: { [key in AssignerAction]: string } = {
    ASSIGN: t('ACTION_ASSIGN'),
    RE_ASSIGN: t('ACTION_RE_ASSIGN'),
  }

  const Status: { [key in ApplicationStatus]: string } = {
    DRAFT: t('STATUS_DRAFT'),
    SUBMITTED: t('STATUS_SUBMITTED'),
    CHANGES_REQUIRED: t('STATUS_CHANGES_REQUIRED'),
    RE_SUBMITTED: t('STATUS_RE_SUBMITTED'),
    COMPLETED: t('STATUS_COMPLETED'),
  }
  const Outcome: { [key in ApplicationOutcome]: string } = {
    PENDING: t('OUTCOME_PENDING'),
    APPROVED: t('OUTCOME_APPROVED'),
    REJECTED: t('OUTCOME_REJECTED'),
    EXPIRED: t('OUTCOME_EXPIRED'),
    WITHDRAWN: t('OUTCOME_WITHDRAWN'),
  }

  const Decision: {
    [key in Decision]: string
  } = {
    LIST_OF_QUESTIONS: t('DECISION_LIST_OF_QUESTIONS'),
    CHANGES_REQUESTED: t('DECISION_CHANGES_REQUESTED'),
    CONFORM: t('DECISION_CONFORM'),
    NON_CONFORM: t('DECISION_NON_CONFORM'),
    NO_DECISION: t('DECISION_NO_DECISION'),
  }

  const ReviewAction: { [key in ReviewerAction]: string } = {
    SELF_ASSIGN: t('ACTION_SELF_ASSIGN'),
    START_REVIEW: t('ACTION_START'),
    VIEW_REVIEW: t('ACTION_VIEW'),
    CONTINUE_REVIEW: t('ACTION_CONTINUE'),
    RESTART_REVIEW: t('ACTION_PENDING'),
    MAKE_DECISION: t('ACTION_MAKE_DECISION'),
    UPDATE_REVIEW: t('ACTION_UPDATE'),
    AWAITING_RESPONSE: t('ACTION_AWAITING_RESPONSE'),
  }

  const ReviewResponse: { [key in ReviewResponseDecision]: string } = {
    APPROVE: t('LABEL_REVIEW_APPROVED'),
    DECLINE: t('LABEL_REVIEW_DECLINED'),
    AGREE: t('LABEL_CONSOLIDATION_AGREEMENT'),
    DISAGREE: t('LABEL_CONSOLIDATION_DISAGREEMENT'),
  }

  return { AssignAction, Status, Outcome, Decision, ReviewAction, ReviewResponse }
}

export default useLocalisedEnums
