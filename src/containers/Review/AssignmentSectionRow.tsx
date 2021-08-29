import React, { useEffect, useState } from 'react'
import { Dropdown, Grid, Label, Message } from 'semantic-ui-react'
import { useUserState } from '../../contexts/UserState'
import strings from '../../utils/constants'
import { AssignmentOption } from '../../utils/data/assignmentOptions'
import {
  ReviewAssignmentStatus,
  ReviewStatus,
  TemplateElementCategory,
} from '../../utils/generated/graphql'
import useUpdateReviewAssignment from '../../utils/hooks/useUpdateReviewAssignment'
import { AssignmentDetails, FullStructure, User } from '../../utils/types'

type AssignmentSectionRowProps = {
  assignments: AssignmentDetails[]
  sectionCode: string
  structure: FullStructure
  shouldAssignState: [number | boolean, React.Dispatch<React.SetStateAction<number | boolean>>]
}
// Component renders options calculated in getAssignmentOptions, and will execute assignment mutation on drop down change
const AssignmentSectionRow: React.FC<AssignmentSectionRowProps> = (props) => {
  const { assignments, sectionCode, structure, shouldAssignState } = props
  const {
    userState: { currentUser },
  } = useUserState()
  const [assignmentError, setAssignmentError] = useState(false)
  const { assignSectionToUser } = useUpdateReviewAssignment(structure)

  const assignmentOptions = getAssignmentOptions(props, currentUser)
  if (!assignmentOptions) return null

  const onAssignment = async (value: number) => {
    if (value === AssignmentOption.NOT_ASSIGNED || value === assignmentOptions.selected) return
    if (value === AssignmentOption.UNASSIGN) return console.log('un assignment not implemented')
    const assignment = assignments.find((assignment) => assignment.reviewer.id === value)
    if (!assignment) return
    try {
      await assignSectionToUser({ assignment, sectionCode })
    } catch (e) {
      console.log(e)
      setAssignmentError(true)
    }
  }

  const isLastLevel = (selected: number): boolean => {
    const assignment = assignments.find((assignment) => assignment.reviewer.id === selected)
    if (!assignment) return false
    return assignment.isLastLevel
  }

  return (
    <Grid className="section-single-row-box-container">
      <Grid.Row>
        <Grid.Column className="centered-flex-box-row">
          <Label className="simple-label" content={strings.LABEL_REVIEWER} />
          <Assignee
            assignmentError={assignmentError}
            assignmentOptions={assignmentOptions}
            checkIsLastLevel={isLastLevel}
            onAssignment={onAssignment}
            shouldAssignState={shouldAssignState}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

interface AssigneeProps {
  assignmentError: boolean
  assignmentOptions: {
    isCompleted: boolean
    selected: number
    options: {
      key: number
      value: number
      text: string
    }[]
  }
  checkIsLastLevel: (assignee: number) => boolean
  onAssignment: (assignee: number) => void
  shouldAssignState: [number | boolean, React.Dispatch<React.SetStateAction<number | boolean>>]
}

const Assignee: React.FC<AssigneeProps> = ({
  assignmentError,
  assignmentOptions,
  checkIsLastLevel,
  onAssignment,
  shouldAssignState: [shouldAssign, setShouldAssign],
}) => {
  // Do auto-assign for other sections when assignee is selected
  // for assignment in another row when shouldAssign == assignee index
  // Note: This is required to be passed on as props to be processed
  // in each row since the fullStructure is related to each section
  useEffect(() => {
    // Option -1 (UNASSIGNED) or 0 (Re-assign) shouldn't change others
    if ((shouldAssign as number) < 1) return
    onAssignment(shouldAssign as number)
  }, [shouldAssign])

  const onAssigneeSelection = async (_: any, { value }: any) => {
    onAssignment(value as number)
    // When review isLastLevel then all sections are assigned to same user (similar to consolidation)
    if (checkIsLastLevel(value)) setShouldAssign(value as number)
  }

  const { isCompleted, options, selected } = assignmentOptions

  if (assignmentError) return <Message error title={strings.ERROR_GENERIC} />
  return (
    <Dropdown
      className="reviewer-dropdown"
      options={options}
      value={selected}
      disabled={isCompleted}
      onChange={onAssigneeSelection}
    />
  )
}

const getOptionFromAssignment = ({
  review,
  isCurrentUserReviewer,
  reviewer,
}: AssignmentDetails) => ({
  key: reviewer.id,
  value: reviewer.id,
  text: isCurrentUserReviewer
    ? strings.ASSIGNMENT_YOURSELF
    : `${reviewer.firstName || ''} ${reviewer.lastName || ''}`,
  disabled: review?.current.reviewStatus === ReviewStatus.Submitted,
})

const getAssignmentOptions = (
  { assignments, sectionCode, structure }: AssignmentSectionRowProps,
  currentUser: User | null
) => {
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
  const elements = Object.values(structure?.elementsById || {})
  const numberOfAssignableElements = elements.filter(
    ({ element }) =>
      (!sectionCode || element.sectionCode === sectionCode) &&
      element.category === TemplateElementCategory.Question
  ).length

  if (numberOfAssignableElements === 0) return null

  console.log('current', currentUser)

  // This could differ from currentUserAssignable list because self assignable assignments don't have assigner
  const currentlyAssigned = assignments.find(
    (assignment) =>
      assignment.reviewer.id !== currentUser?.userId &&
      assignment.current.assignmentStatus === ReviewAssignmentStatus.Assigned &&
      matchAssignmentToSection(assignment, sectionCode)
  )

  console.log('currentlyAssigned', currentlyAssigned)

  // For now just show an option to un assign
  if (currentlyAssigned)
    return {
      selected: currentlyAssigned.reviewer.id,
      isCompleted: currentlyAssigned.review?.current.reviewStatus === ReviewStatus.Submitted,
      options: [
        getOptionFromAssignment(currentlyAssigned),
        {
          key: AssignmentOption.UNASSIGN,
          value: AssignmentOption.UNASSIGN,
          text: strings.ASSIGNMENT_UNASSIGN,
        },
      ],
    }

  console.log('currentUserAssignable', currentUserAssignable)

  return {
    selected: AssignmentOption.NOT_ASSIGNED,
    isCompleted: false,
    options: [
      ...currentUserAssignable.map((assignment) => getOptionFromAssignment(assignment)),
      {
        key: AssignmentOption.NOT_ASSIGNED,
        value: AssignmentOption.NOT_ASSIGNED,
        text: strings.ASSIGNMENT_NOT_ASSIGNED,
      },
    ],
  }
}
// Find at least one reviewQuestion assignment in assignment that matches sectionCode
const matchAssignmentToSection = (assignment: AssignmentDetails, sectionCode: string) =>
  assignment.reviewQuestionAssignments.some(
    (reviewQuestionAssignment) =>
      reviewQuestionAssignment.templateElement?.section?.code === sectionCode
  )

export default AssignmentSectionRow
