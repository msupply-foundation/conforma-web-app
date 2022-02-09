import React, { useState } from 'react'
import { Grid, Label, ModalProps } from 'semantic-ui-react'
import ModalConfirmation from '../../../components/Main/ModalConfirmation'
import { useUserState } from '../../../contexts/UserState'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { AssignmentOption } from '../../../utils/data/assignmentOptions'
import { useUnassignReviewAssignmentMutation } from '../../../utils/generated/graphql'
import useUpdateReviewAssignment from '../../../utils/hooks/useUpdateReviewAssignment'
import { AssignmentDetails, FullStructure } from '../../../utils/types'
import AssigneeDropdown from './AssigneeDropdown'
import useGetAssignmentOptions from './useGetAssignmentOptions'
import Reassignment from './Reassignment'

type AssignmentSectionRowProps = {
  assignments: AssignmentDetails[]
  sectionCode: string
  structure: FullStructure
  shouldAssignState: [number, React.Dispatch<React.SetStateAction<number>>]
}
// Component renders options calculated in getAssignmentOptions, and will execute assignment mutation on drop down change
const AssignmentSectionRow: React.FC<AssignmentSectionRowProps> = (props) => {
  const { strings } = useLanguageProvider()
  const UNASSIGN_MESSAGE = {
    title: strings.UNASSIGN_TITLE,
    message: strings.UNASSIGN_MESSAGE,
    option: strings.BUTTON_SUBMIT,
  }
  const getAssignmentOptions = useGetAssignmentOptions()
  const { assignments, sectionCode, structure, shouldAssignState } = props
  const {
    userState: { currentUser },
  } = useUserState()
  const [isReassignment, setIsReassignment] = useState(false)
  const [assignmentError, setAssignmentError] = useState(false)
  const [unassignmentError, setUnassignmentError] = useState(false)
  const [showUnassignmentModal, setShowUnassignmentModal] = useState<ModalProps>({ open: false })
  const [unassignSectionFromUser] = useUnassignReviewAssignmentMutation({
    onCompleted: () => {
      structure.reload()
    },
  })
  const { assignSectionToUser } = useUpdateReviewAssignment(structure)
  const elements = Object.values(structure?.elementsById || {})

  const assignmentOptions = getAssignmentOptions(
    {
      assignments,
      sectionCode,
      elements,
    },
    currentUser
  )
  if (!assignmentOptions) return null

  const onSelectedOption = async (value: number) => {
    if (value === assignmentOptions.selected) return
    if (value === AssignmentOption.REASSIGN) setIsReassignment(true)

    if (value === AssignmentOption.UNASSIGN) {
      const unassignment = assignments.find(
        (assignment) => assignment.reviewer.id === assignmentOptions.selected
      )
      if (unassignment)
        setShowUnassignmentModal({
          ...UNASSIGN_MESSAGE,
          open: true,
          onClick: () => unassignUser(unassignment.id),
          onClose: () => setShowUnassignmentModal({ open: false }),
        })
    }

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

  const unassignUser = async (unassignmentId: number) => {
    try {
      await unassignSectionFromUser({ variables: { unassignmentId } })
    } catch (e) {
      console.log(e)
      setUnassignmentError(true)
    }
  }

  const selectedReviewer = assignmentOptions.options.find(
    ({ value }) => value === assignmentOptions.selected
  )

  return (
    <Grid className="section-single-row-box-container">
      <Grid.Row>
        <Grid.Column className="centered-flex-box-row">
          {isReassignment ? (
            <>
              <Label className="simple-label" content={strings.LABEL_UNASSIGN_FROM} />
              <Label content={selectedReviewer?.text} />
            </>
          ) : (
            <>
              <Label className="simple-label" content={strings.LABEL_REVIEWER} />
              <AssigneeDropdown
                assignmentError={assignmentError || unassignmentError}
                assignmentOptions={assignmentOptions}
                checkIsLastLevel={isLastLevel}
                onSelection={onSelectedOption}
                shouldAssignState={shouldAssignState}
              />
            </>
          )}
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        {isReassignment && (
          <Reassignment
            assignments={assignments}
            sectionCode={sectionCode}
            elements={elements}
            isLastLevel={isLastLevel}
            shouldAssignState={shouldAssignState}
            previousAssignee={assignmentOptions.selected}
          />
        )}
        <ModalConfirmation {...showUnassignmentModal} />
      </Grid.Row>
    </Grid>
  )
}

export default AssignmentSectionRow
