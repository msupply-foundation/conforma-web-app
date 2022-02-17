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
      ({ isCurrentUserAssigner, isSelfAssignable }) => isCurrentUserAssigner || isSelfAssignable
    )

    const currentlyAssigned = assignments.find((assignment) =>
      assignment.current.assignmentStatus === ReviewAssignmentStatus.Assigned &&
      // Restriction only apply to level one that isn't lastLevel
      (assignment.review?.level || 1 > 1 || assignment.isLastLevel)
        ? true
        : matchAssignmentToSection(assignment, sectionCode)
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

    if (!previousAssignee)
      assigneeOptions.options.push({
        key: NOT_ASSIGNED,
        value: NOT_ASSIGNED,
        text: strings.ASSIGNMENT_NOT_ASSIGNED,
      })

    return assigneeOptions
  }
  // Find at least one reviewQuestion assignment in assignment that matches sectionCode
  const matchAssignmentToSection = (assignment: AssignmentDetails, sectionCode: string) =>
    assignment.reviewQuestionAssignments.some(
      (reviewQuestionAssignment) =>
        reviewQuestionAssignment.templateElement?.section?.code === sectionCode
    )
  return getAssignmentOptions
}

export default useGetAssignmentOptions
