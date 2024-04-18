import React, { useEffect, useState, SetStateAction } from 'react'
import { Grid, Label } from 'semantic-ui-react'
import useConfirmationModal from '../../../utils/hooks/useConfirmationModal'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { AssignmentDetails, FullStructure, SectionAssignee } from '../../../utils/types'
import AssigneeDropdown from './AssigneeDropdown'
import useGetAssignmentOptions, { NOT_ASSIGNED } from './useGetAssignmentOptions'
import Reassignment from './Reassignment'
import AssigneeLabel from './AssigneeLabel'
import useUpdateAssignment from '../../../utils/hooks/useUpdateAssignment'

type AssignmentSectionRowProps = {
  assignments: AssignmentDetails[]
  sectionCode: string
  reviewLevel: number
  structure: FullStructure
  assignedSections: SectionAssignee
  setAssignedSections: (assingedSections: SectionAssignee) => void
  setEnableSubmit: React.Dispatch<SetStateAction<boolean>>
  setAssignmentError: React.Dispatch<SetStateAction<string | null>>
}
// Component renders options calculated in getAssignmentOptions, and will execute assignment mutation on drop down change
const AssignmentSectionRow: React.FC<AssignmentSectionRowProps> = ({
  assignments,
  sectionCode,
  reviewLevel,
  structure,
  assignedSections,
  setAssignedSections,
  setEnableSubmit,
  setAssignmentError,
}) => {
  const { t } = useLanguageProvider()
  const { ConfirmModal, showModal } = useConfirmationModal({
    title: t('UNASSIGN_TITLE'),
    message: t('UNASSIGN_MESSAGE'),
    confirmText: t('BUTTON_SUBMIT'),
  })

  const { submitAssignments } = useUpdateAssignment({
    fullStructure: structure,
  })
  const getAssignmentOptions = useGetAssignmentOptions()
  const [isReassignment, setIsReassignment] = useState(false)
  const [originalAssignee, setOriginalAssignee] = useState<string>()

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
    assignee: assignedSections?.[sectionCode]?.newAssignee,
  })
  if (!assignmentOptions) return null

  const isLastLevel = assignments.length > 0 && assignments[0].isLastLevel

  const isSingleReviewerLevel = assignments.length > 0 && assignments[0].isSingleReviewerLevel

  const onAssigneeSelection = async (assignee: number) => {
    // When review isLastLevel or if explicitly set to single reviewer, then all
    // sections are assigned to same user (similar to consolidation)
    if (isLastLevel || isSingleReviewerLevel) {
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

  const unassignAssignee = async () => {
    const unassignment = assignments.find(
      (assignment) => assignment.reviewer.id === assignmentOptions.selected
    )
    const sectionToUnassign = null
    // NOTE: We currently unassign ALL sections from a reviewer at once. If we
    // want to change this to only unassign the selected section, then enable
    // the commented-out lines below instead of the line above. Ideally this
    // would be user-selectable

    // const sectionToUnassign: SectionAssignee = {
    //   [sectionCode]: { previousAssignee: unassignment?.reviewer.id, newAssignee: undefined },
    // }
    if (!unassignment) return
    try {
      await submitAssignments(Number(reviewLevel), sectionToUnassign, [unassignment])
    } catch (e) {
      console.log(e)
      setAssignmentError(t('ASSIGNMENT_ERROR_UNASSIGN'))
    }
  }

  const isSelfAssignment = !assignmentOptions.options.some(
    ({ text }) => text != t('ASSIGNMENT_YOURSELF')
  )

  const levelName =
    structure.stages
      .find(({ stage: { number } }) => number === structure.info.current.stage.number)
      ?.levels.find(({ number }) => reviewLevel === number)?.name || t('ERROR_LEVEL_NOT_FOUND')

  return (
    <Grid stackable columns={2} className="section-single-row-box-container">
      <Grid.Row className="assigning-row">
        <Grid.Column className="review-level" width={5}>
          <Label className="simple-label">
            {t('REVIEW_FILTER_LEVEL')}: <strong>{levelName}</strong>
          </Label>
        </Grid.Column>
        <Grid.Column className="centered-flex-box-row" width={8}>
          {originalAssignee && assignmentOptions.isSubmitted ? (
            <AssigneeLabel
              assignee={originalAssignee}
              isCompleted={assignmentOptions.isCompleted}
              isSelfAssigned={isSelfAssignment}
              isReassignment={isReassignment}
              setIsReassignment={setIsReassignment}
              setIsUnassignment={() => showModal({ onConfirm: () => unassignAssignee() })}
            />
          ) : assignmentOptions.options.length === 0 ? (
            <Label className="simple-label" content={t('ASSIGNMENT_NOT_AVAILABLE')} />
          ) : (
            <>
              <Label className="simple-label" content={t('LABEL_REVIEWER')} />
              <AssigneeDropdown
                assignmentOptions={assignmentOptions}
                sectionCode={sectionCode}
                onChangeMethod={(selected: number) => onAssigneeSelection(selected)}
              />
            </>
          )}
        </Grid.Column>
        <Grid.Column className="centered-flex-box-row" width={3}>
          {!assignmentOptions.isSubmitted && (
            <a
              className="user-action clickable"
              style={{ textAlign: 'center' }}
              onClick={() => window.open(`/application/${structure.info.serial}`)}
            >
              {t('ACTION_PREVIEW_APPLICATION')}
            </a>
          )}
        </Grid.Column>
      </Grid.Row>
      {isReassignment && (
        <Grid.Row>
          <Reassignment
            sectionCode={sectionCode}
            isLastLevel={isLastLevel}
            assignedSections={assignedSections}
            setAssignedSections={setAssignedSections}
            assignmentOptions={assignmentOptions}
          />
        </Grid.Row>
      )}
      <ConfirmModal />
    </Grid>
  )
}

export default AssignmentSectionRow
