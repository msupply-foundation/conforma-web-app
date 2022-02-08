import {
  AssignmentDetails,
  AssignmentOptions,
  AssignmentOption,
  PageElement,
  User,
} from '../../../utils/types'
import {
  ReviewAssignmentStatus,
  ReviewStatus,
  TemplateElementCategory,
} from '../../../utils/generated/graphql'
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
    elements: PageElement[]
    assignee?: number
  }

  const getAssignmentOptions = (
    { assignments, sectionCode, elements, assignee: previousAssignee }: GetAssignmentOptionsProps,
    currentUser: User | null
  ): AssignmentOptions | null => {
    const currentSectionAssignable = assignments.filter(
      ({ assignableSectionRestrictions }) =>
        assignableSectionRestrictions.length === 0 ||
        assignableSectionRestrictions.includes(sectionCode)
    )

    const currentUserAssignable = currentSectionAssignable.filter(
      ({ isCurrentUserAssigner, isSelfAssignable }) => isCurrentUserAssigner || isSelfAssignable
    )

    // Dont' want to render assignment section row if they have no actions
    if (currentUserAssignable.length === 0) return null
    const numberOfAssignableElements = elements.filter(
      ({ element }) =>
        (!sectionCode || element.sectionCode === sectionCode) &&
        element.category === TemplateElementCategory.Question
    ).length

    if (numberOfAssignableElements === 0) return null

    const currentlyAssigned = assignments.find(
      (assignment) =>
        assignment.current.assignmentStatus === ReviewAssignmentStatus.Assigned &&
        matchAssignmentToSection(assignment, sectionCode)
    )

    if (!previousAssignee && currentlyAssigned)
      return {
        selected: currentlyAssigned.reviewer.id,
        isCompleted: currentlyAssigned.review?.current.reviewStatus === ReviewStatus.Submitted,
        options: [getOptionFromAssignment(currentlyAssigned)],
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
