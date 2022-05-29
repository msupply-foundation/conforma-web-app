import { useLanguageProvider } from '../../contexts/Localisation'
import {
  ApplicationOutcome,
  ApplicationStatus,
  Decision,
  ReviewResponseDecision,
} from '../generated/graphql'

/*
For converting enum names from database/server (Outcomes, Statuses, etc. to
localisable string references)
*/

const useLocalisedEnums = () => {
  const { strings } = useLanguageProvider()

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

  const ReviewResponse: { [key in ReviewResponseDecision]: string } =
    {
      APPROVE: strings.LABEL_REVIEW_APPROVED,
      DECLINE: strings.LABEL_REVIEW_DECLINED,
      AGREE: strings.LABEL_CONSOLIDATION_AGREEMENT,
      DISAGREE: strings.LABEL_CONSOLIDATION_DISAGREEMENT,
    }

  return { Status, Outcome, Decision, ReviewResponse }
}

export default useLocalisedEnums
