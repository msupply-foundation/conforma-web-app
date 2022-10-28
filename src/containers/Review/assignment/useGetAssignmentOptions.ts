import { AssignmentDetails, AssignmentOptions, AssignmentOption } from '../../../utils/types'
import { ReviewAssignmentStatus, ReviewStatus } from '../../../utils/generated/graphql'
import { useLanguageProvider } from '../../../contexts/Localisation'

const NOT_ASSIGNED = 0

const useGetAssignmentOptions = () => {
  const { strings } = useLanguageProvider()

  const getOptionFromAssignment = ({
    review,
    reviewer,
    isCurrentUserReviewer,
  }: AssignmentDetails): AssignmentOption => {
    return {
      key: reviewer.id,
      value: reviewer.id,
      text: isCurrentUserReviewer
        ? strings.ASSIGNMENT_YOURSELF
        : `${reviewer.firstName || ''} ${reviewer.lastName || ''}`,
      disabled: review?.current.reviewStatus === ReviewStatus.Submitted,
    }
  }
  interface GetAssignmentOptionsProps {
    assignments: AssignmentDetails[]
    sectionCode: string
    assignee?: number
  }

  const getAssignmentOptions = ({
    assignments,
    sectionCode,
    assignee: previousAssignee,
  }: GetAssignmentOptionsProps): AssignmentOptions | null => {
    const currentSectionAssignable = assignments.filter(
      ({ allowedSections }) => allowedSections.length === 0 || allowedSections.includes(sectionCode)
    )

    const currentUserAssignable = currentSectionAssignable.find(
      ({ isCurrentUserReviewer }) => isCurrentUserReviewer
    )

    const otherAssignableUsers = currentSectionAssignable.filter(
      ({ isCurrentUserAssigner, isCurrentUserReviewer }) =>
        isCurrentUserAssigner && !isCurrentUserReviewer
    )

    const currentlyAssigned = assignments.find(
      ({ assignedSections, current: { assignmentStatus } }) =>
        assignmentStatus === ReviewAssignmentStatus.Assigned &&
        assignedSections.includes(sectionCode)
    )

    const orderedAssignees = otherAssignableUsers
      .map((assignment) => getOptionFromAssignment(assignment))
      .sort((a, b) => (a.text < b.text ? -1 : 1))
    const assignees = currentUserAssignable
      ? [getOptionFromAssignment(currentUserAssignable), ...orderedAssignees]
      : orderedAssignees

    if (!previousAssignee && currentlyAssigned)
      return {
        selected: currentlyAssigned.reviewer.id,
        isCompleted: currentlyAssigned.review?.current.reviewStatus === ReviewStatus.Submitted,
        options: assignees,
      }

    return {
      selected: previousAssignee || NOT_ASSIGNED,
      isCompleted: false,
      options: assignees,
    }
  }

  return getAssignmentOptions
}

export default useGetAssignmentOptions
