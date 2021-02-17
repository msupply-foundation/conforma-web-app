import { LabelProps } from 'semantic-ui-react'
import strings from '../../constants'
import { ReviewAssignmentStatus, ReviewStatus } from '../../generated/graphql'
import { AssignmentDetails } from '../../types'

/**
 * @function getStartLabel
 * Get label string of option to display on Review start page
 * @param status Current status of review
 */
export const getStartLabel = (status: ReviewStatus) => {
  switch (status) {
    case ReviewStatus.Draft:
      return strings.BUTTON_REVIEW_CONTINUE
    case ReviewStatus.Pending:
      return strings.BUTTON_REVIEW_RE_REVIEW
    case ReviewStatus.ChangesRequested:
      return strings.BUTTON_REVIEW_MAKE_UPDATES
    case ReviewStatus.Submitted || ReviewStatus.Locked:
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
  const { status } = review
  switch (status) {
    case ReviewStatus.Draft:
      return { color: 'brown', label: status }
    case ReviewStatus.Pending:
      return { color: 'yellow', label: status }
    case ReviewStatus.ChangesRequested:
      return { color: 'red', label: status }
    case ReviewStatus.Submitted || ReviewStatus.Locked:
      return { label: status }
    default:
      return { label: status }
  }
}
