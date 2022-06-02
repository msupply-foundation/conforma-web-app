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

    const currentUserAssignable = currentSectionAssignable.filter(
      ({ isCurrentUserAssigner, isSelfAssignable, isCurrentUserReviewer }) => isCurrentUserAssigner || (isSelfAssignable && isCurrentUserReviewer)
    )

    const currentlyAssigned = assignments.find(
      ({ assignedSections, current: { assignmentStatus } }) =>
        assignmentStatus === ReviewAssignmentStatus.Assigned &&
        assignedSections.includes(sectionCode)
    )

    if (!previousAssignee && currentlyAssigned)
      return {
        selected: currentlyAssigned.reviewer.id,
        isCompleted: currentlyAssigned.review?.current.reviewStatus === ReviewStatus.Submitted,
        options: [
          ...currentUserAssignable.map((assignment) => getOptionFromAssignment(assignment)),
        ],
      }

    const assigneeOptions = {
      selected: previousAssignee || NOT_ASSIGNED,
      isCompleted: false,
      options: [...currentUserAssignable.map((assignment) => getOptionFromAssignment(assignment))],
    }

    assigneeOptions.options.push({
      key: NOT_ASSIGNED,
      value: NOT_ASSIGNED,
      text: strings.ASSIGNMENT_NOT_ASSIGNED,
    })

    return assigneeOptions
  }

  return getAssignmentOptions
}

export default useGetAssignmentOptions
