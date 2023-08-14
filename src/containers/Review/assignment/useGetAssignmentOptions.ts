import { AssignmentDetails, AssignmentOptions, AssignmentOption } from '../../../utils/types'
import { ReviewAssignmentStatus, ReviewStatus } from '../../../utils/generated/graphql'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { useUserState } from '../../../contexts/UserState'

export const NOT_ASSIGNED = -1

const useGetAssignmentOptions = () => {
  const { t } = useLanguageProvider()
  const {
    userState: { currentUser },
  } = useUserState()

  const getOptionFromAssignment = ({
    review,
    reviewer,
    isCurrentUserReviewer,
  }: AssignmentDetails): AssignmentOption => {
    return {
      key: reviewer.id,
      value: reviewer.id,
      text: isCurrentUserReviewer
        ? t('ASSIGNMENT_YOURSELF')
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

    // Possible reviewers to show on dropdown, are either
    // - Assignees that can be assigned by current assigner (keep all Available assignee because is considering Re-assignmet)
    // - Self-assignemnt reviewer with the sectionCode in its availableSections ReviewAssignment record
    const currentUserAssignable = currentSectionAssignable.filter(
      ({ isCurrentUserAssigner, isSelfAssignable, isCurrentUserReviewer, availableSections }) =>
        isCurrentUserAssigner ||
        (isSelfAssignable && isCurrentUserReviewer && availableSections.includes(sectionCode))
    )

    const currentlyAssigned = assignments.find(
      ({ assignedSections, current: { assignmentStatus } }) =>
        assignmentStatus === ReviewAssignmentStatus.Assigned &&
        assignedSections.includes(sectionCode)
    )

    if (!previousAssignee && currentlyAssigned)
      return {
        selected: currentlyAssigned.reviewer.id,
        isSubmitted: true,
        isCompleted: currentlyAssigned.review?.current.reviewStatus === ReviewStatus.Submitted,
        options: [
          ...currentUserAssignable.map((assignment) => getOptionFromAssignment(assignment)),
        ],
      }

    const assigneeOptions = {
      selected: previousAssignee || NOT_ASSIGNED,
      isSubmitted: false,
      isCompleted: false,
      options: [...currentUserAssignable.map((assignment) => getOptionFromAssignment(assignment))],
    }

    // Move current user "Yourself" to top of list
    const currentUserOption = assigneeOptions.options.find(
      (option) => option.value === currentUser?.userId
    )

    // Sort and Remove currentUser from the list (to be added at the top)
    const sortedOptions = assigneeOptions.options
      .filter((option) => option.key !== currentUser?.userId)
      .sort((a, b) => (a.text < b.text ? -1 : 1))

    if (currentUserOption) sortedOptions.unshift(currentUserOption)
    assigneeOptions.options = sortedOptions

    return assigneeOptions
  }

  return getAssignmentOptions
}

export default useGetAssignmentOptions
