import { AssignmentDetails, PageElement } from '../../utils/types'
import { ReviewAssignmentStatus, TemplateElementCategory } from '../../utils/generated/graphql'
import { AssignmentOption } from '../../utils/data/assignmentOptions'
import strings from '../../utils/constants'

const getOptionFromAssignment = ({ reviewer, isCurrentUserReviewer }: AssignmentDetails) => ({
  key: reviewer.id,
  value: reviewer.id,
  text: isCurrentUserReviewer
    ? strings.ASSIGNMENT_YOURSELF
    : `${reviewer.firstName || ''} ${reviewer.lastName || ''}`,
})

interface GetAssignmentOptionsProps {
  assignments: AssignmentDetails[]
  sectionCode: string
  elements: PageElement[]
  previousAssignee?: number
}

const getAssignmentOptions = ({
  assignments,
  sectionCode,
  elements,
  previousAssignee,
}: GetAssignmentOptionsProps) => {
  const currentSectionAssignable = assignments.filter(
    ({ assignableSectionRestrictions }) =>
      assignableSectionRestrictions.length === 0 ||
      assignableSectionRestrictions.includes(sectionCode)
  )

  const currentUserAssignable = currentSectionAssignable.filter(
    (assignment) => assignment.isCurrentUserAssigner
  )

  // Dont' want to render assignment section row if they have no actions
  if (currentUserAssignable.length === 0) return null
  const numberOfAssignableElements = elements.filter(
    ({ element }) =>
      (!sectionCode || element.sectionCode === sectionCode) &&
      element.category === TemplateElementCategory.Question
  ).length

  if (numberOfAssignableElements === 0) return null

  // This could differ from currentUserAssignable list because self assignable assignments don't have assigner
  const currentlyAssigned = assignments.find(
    (assignment) =>
      assignment.current.assignmentStatus === ReviewAssignmentStatus.Assigned &&
      matchAssignmentToSection(assignment, sectionCode)
  )

  if (!previousAssignee && currentlyAssigned)
    return {
      selected: currentlyAssigned.reviewer.id,
      options: [
        getOptionFromAssignment(currentlyAssigned),
        {
          key: AssignmentOption.UNASSIGN,
          value: AssignmentOption.UNASSIGN,
          text: strings.ASSIGNMENT_UNASSIGN,
        },
        {
          key: AssignmentOption.REASSIGN,
          value: AssignmentOption.REASSIGN,
          text: strings.ASSIGNMENT_REASSIGN,
        },
      ],
    }

  const assigneeOptions = {
    selected: previousAssignee || AssignmentOption.NOT_ASSIGNED,
    options: [...currentUserAssignable.map((assignment) => getOptionFromAssignment(assignment))],
  }

  if (!previousAssignee)
    assigneeOptions.options.push({
      key: AssignmentOption.NOT_ASSIGNED,
      value: AssignmentOption.NOT_ASSIGNED,
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

export default getAssignmentOptions
