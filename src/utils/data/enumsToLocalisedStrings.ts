import strings from '../constants'
import { ApplicationOutcome, ApplicationStatus, Decision } from '../generated/graphql'

const enumsToLocalStringsMap: {
  [key in ApplicationStatus | ApplicationOutcome | Decision]: string
} = {
  // STATUSES
  DRAFT: strings.STATUS_DRAFT,
  SUBMITTED: strings.STATUS_SUBMITTED,
  CHANGES_REQUIRED: strings.STATUS_CHANGES_REQUIRED,
  RE_SUBMITTED: strings.STATUS_RE_SUBMITTED,
  COMPLETED: strings.STATUS_COMPLETED,
  // OUTCOMES
  PENDING: strings.OUTCOME_PENDING,
  APPROVED: strings.OUTCOME_APPROVED,
  REJECTED: strings.OUTCOME_REJECTED,
  EXPIRED: strings.OUTCOME_EXPIRED,
  WITHDRAWN: strings.OUTCOME_WITHDRAWN,
  // DECISIONS
  LIST_OF_QUESTIONS: strings.DECISION_LIST_OF_QUESTIONS,
  CHANGES_REQUESTED: strings.DECISION_CHANGES_REQUESTED,
  CONFORM: strings.DECISION_CONFORM,
  NON_CONFORM: strings.DECISION_NON_CONFORM,
  NO_DECISION: strings.DECISION_NO_DECISION,
}

export default enumsToLocalStringsMap
