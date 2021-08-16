import strings from '../constants'
import { ApplicationOutcome, ApplicationStatus } from '../generated/graphql'

const enumsToLocalStringsMap: { [key in ApplicationStatus | ApplicationOutcome]: string } = {
  DRAFT: strings.STATUS_DRAFT,
  SUBMITTED: strings.STATUS_SUBMITTED,
  CHANGES_REQUIRED: strings.STATUS_CHANGES_REQUIRED,
  RE_SUBMITTED: strings.STATUS_RE_SUBMITTED,
  COMPLETED: strings.STATUS_COMPLETED,
  PENDING: strings.OUTCOME_PENDING,
  APPROVED: strings.OUTCOME_APPROVED,
  REJECTED: strings.OUTCOME_REJECTED,
  EXPIRED: strings.OUTCOME_EXPIRED,
  WITHDRAWN: strings.OUTCOME_WITHDRAWN,
}

export default enumsToLocalStringsMap
