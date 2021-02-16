import { LabelProps } from 'semantic-ui-react'
import strings from '../../constants'
import { REVIEW_STATUS } from '../../data/reviewStatus'
import { ReviewAssignmentStatus } from '../../generated/graphql'
import { AssignmentDetails, ReviewDetails } from '../../types'

/**
 * @function getStartLabel
 * Get label string of option to display on Review start page
 * @param status Current status of review
 */
export const getStartLabel = (status: string) => {
  switch (status) {
    case REVIEW_STATUS.DRAFT:
      return strings.BUTTON_REVIEW_CONTINUE
    case REVIEW_STATUS.PENDING:
      return strings.BUTTON_REVIEW_RE_REVIEW
    case REVIEW_STATUS.CHANGES_REQUESTED:
      return strings.BUTTON_REVIEW_MAKE_UPDATES
    case REVIEW_STATUS.SUBMITTED || REVIEW_STATUS.LOCKED:
      return strings.BUTTON_REVIEW_VIEW
    default:
      return status
  }
}

/**
 * @function getStatusLabel
 * Get status to display of Review to display in UI
 * @param assignment Assignmnet details with review status (if started)
 */
export const getStatusLabel = (assignment: AssignmentDetails): LabelProps | undefined => {
  const { review, status: assignmentStatus } = assignment
  if (assignmentStatus === ReviewAssignmentStatus.NotAvailable) return undefined
  if (assignmentStatus === ReviewAssignmentStatus.Available)
    return { label: strings.LABEL_REVIEW_NOT_ASSIGNED }

  // Would get here if assignmentStatus is Assigned or AvailableForSelfAssignment
  if (!review?.status) return { color: 'red', label: strings.LABEL_REVIEW_NOT_STARTED }
  const status = review.status as string
  switch (status) {
    case REVIEW_STATUS.DRAFT:
      return { color: 'brown', label: status }
    case REVIEW_STATUS.PENDING:
      return { color: 'yellow', label: status }
    case REVIEW_STATUS.CHANGES_REQUESTED:
      return { color: 'red', label: status }
    case REVIEW_STATUS.SUBMITTED || REVIEW_STATUS.LOCKED:
      return { label: status }
    default:
      return { label: status }
  }
}
