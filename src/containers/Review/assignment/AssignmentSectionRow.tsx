import React, { useEffect, useState } from 'react'
import { Grid, Label, ModalProps } from 'semantic-ui-react'
import ModalConfirmation from '../../../components/Main/ModalConfirmation'
import { useLanguageProvider } from '../../../contexts/Localisation'
import {
  ReviewAssignmentStatus,
  ReviewStatus,
  useUnassignReviewAssignmentMutation,
} from '../../../utils/generated/graphql'
import { AssignmentDetails, FullStructure, SectionAssignee } from '../../../utils/types'
import AssigneeDropdown from './AssigneeDropdown'
import useGetAssignmentOptions from './useGetAssignmentOptions'
import Reassignment from './Reassignment'
import AssigneeLabel from './AssigneeLabel'

const NOT_ASSIGNED = 0

type AssignmentSectionRowProps = {
  assignments: AssignmentDetails[]
  sectionCode: string
  reviewLevel: number
  structure: FullStructure
  assignedSectionsState: [SectionAssignee, React.Dispatch<React.SetStateAction<SectionAssignee>>]
  setEnableSubmit: React.Dispatch<React.SetStateAction<boolean>>
}
// Component renders options calculated in getAssignmentOptions, and will execute assignment mutation on drop down change
const AssignmentSectionRow: React.FC<AssignmentSectionRowProps> = ({
  assignments,
  sectionCode,
  reviewLevel,
  structure,
  assignedSectionsState,
  setEnableSubmit,
}) => {
  const { strings } = useLanguageProvider()
  const UNASSIGN_MESSAGE = {
    title: strings.UNASSIGN_TITLE,
    message: strings.UNASSIGN_MESSAGE,
    option: strings.BUTTON_SUBMIT,
  }
  const getAssignmentOptions = useGetAssignmentOptions()
  const [isReassignment, setIsReassignment] = useState(false)
  const [assignmentError, setAssignmentError] = useState(false)
  const [unassignmentError, setUnassignmentError] = useState(false)
  const [showUnassignmentModal, setShowUnassignmentModal] = useState<ModalProps>({ open: false })
  const [unassignSectionFromUser] = useUnassignReviewAssignmentMutation({
    onCompleted: () => {
      structure.reload()
    },
  })
  const [assignedSections, setAssignedSections] = assignedSectionsState
  const [originalAssignee, setOriginalAssignee] = useState<string>()
  // const elements = Object.values(structure?.elementsById || {})

  useEffect(() => {
    if (assignmentOptions?.selected != NOT_ASSIGNED) {
      const foundPreviousAssignee = assignments.find(
        ({ reviewer }) => assignmentOptions?.selected === reviewer.id
      )
      if (foundPreviousAssignee) {
        const { reviewer } = foundPreviousAssignee
        setOriginalAssignee(`${reviewer?.firstName || ''} ${reviewer.lastName || ''}`)
      }
    }
  }, [])

  useEffect(() => {
    if (Object.values(assignedSections).some(({ newAssignee }) => newAssignee !== undefined))
      setEnableSubmit(true)
  }, [assignedSections])

  const assignmentOptions = getAssignmentOptions({
    assignments,
    sectionCode,
    // elements,
    assignee: assignedSections[sectionCode]?.newAssignee,
  })

  if (!assignmentOptions) return null

  const onAssigneeSelection = async (assignee: number) => {
    // When review isLastLevel then all sections are assigned to same user (similar to consolidation)
    if (isLastLevel(assignee)) {
      let allSectionsToUserId: SectionAssignee = {}
      Object.keys(assignedSections).forEach(
        (sectionCode) => (allSectionsToUserId[sectionCode] = { newAssignee: assignee as number })
      )
      setAssignedSections(allSectionsToUserId)
    } else
      setAssignedSections({
        ...assignedSections,
        [sectionCode]: { newAssignee: assignee as number },
      })
  }

  const isLastLevel = (selected: number): boolean => {
    const assignment = assignments.find((assignment) => assignment.reviewer.id === selected)
    if (!assignment) return false
    return assignment.isLastLevel
  }

  const setIsUnassignment = () => {
    if (!showUnassignmentModal.open)
      setShowUnassignmentModal({
        ...UNASSIGN_MESSAGE,
        open: true,
        onClick: () => unassignAssignee(),
        onClose: () => setShowUnassignmentModal({ open: false }),
      })
  }

  const unassignAssignee = async () => {
    const unassignment = assignments.find(
      (assignment) => assignment.reviewer.id === assignmentOptions.selected
    )
    if (!unassignment) return
    try {
      await unassignSectionFromUser({ variables: { unassignmentId: unassignment.id } })
    } catch (e) {
      console.log(e)
      setUnassignmentError(true)
    }
  }

  const isSelfAssignment = !assignmentOptions.options.some(
    ({ text }) => text != strings.ASSIGNMENT_YOURSELF
  )

  const isSubmitted =
    assignments.find(
      (assignment) => assignment.current.assignmentStatus === ReviewAssignmentStatus.Assigned
    )?.review?.current.reviewStatus === ReviewStatus.Submitted || false

  const levelName =
    structure.stages
      .find(({ stage: { number } }) => number === structure.info.current.stage.number)
      ?.levels.find(({ number }) => reviewLevel === number)?.name || strings.LEVEL_NOT_FOUND

  return (
    <Grid columns={2} className="section-single-row-box-container">
      <Grid.Row>
        <Grid.Column className="review-level">
          <Label className="simple-label">
            {strings.REVIEW_FILTER_LEVEL}: <strong>{levelName}</strong>
          </Label>
        </Grid.Column>
        <Grid.Column className="centered-flex-box-row">
          {originalAssignee ? (
            <AssigneeLabel
              assignee={originalAssignee}
              isSubmitted={isSubmitted}
              isSelfAssigned={isSelfAssignment}
              isReassignment={isReassignment}
              setIsReassignment={setIsReassignment}
              setIsUnassignment={setIsUnassignment}
            />
          ) : (
            <>
              <Label className="simple-label" content={strings.LABEL_REVIEWER} />
              <AssigneeDropdown
                assignmentError={assignmentError || unassignmentError}
                assignmentOptions={assignmentOptions}
                sectionCode={sectionCode}
                onChangeMethod={(selected: number) => onAssigneeSelection(selected)}
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
            // elements={elements}
            isLastLevel={isLastLevel}
            previousAssignee={assignmentOptions.selected}
            assignedSectionsState={assignedSectionsState}
          />
        )}
        <ModalConfirmation {...showUnassignmentModal} />
      </Grid.Row>
    </Grid>
  )
}

export default AssignmentSectionRow
