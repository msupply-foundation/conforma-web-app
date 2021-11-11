import React, { useState } from 'react'
import { Button, Form, Label, ModalProps } from 'semantic-ui-react'
import { ModalWarning } from '../../components'
import ModalConfirmation from '../../components/Main/ModalConfirmation'
import ReviewComment from '../../components/Review/ReviewComment'
import ReviewDecision from '../../components/Review/ReviewDecision'
import { Decision, ReviewStatus } from '../../utils/generated/graphql'
import useGetDecisionOptions from '../../utils/hooks/useGetDecisionOptions'
import { useGetFullReviewStructureAsync } from '../../utils/hooks/useGetReviewStructureForSection'
import { useRouter } from '../../utils/hooks/useRouter'
import useSubmitReview from '../../utils/hooks/useSubmitReview'
import { useLanguageProvider } from '../../contexts/Localisation'
import { AssignmentDetails, FullStructure } from '../../utils/types'

type ReviewSubmitProps = {
  structure: FullStructure
  assignment: AssignmentDetails
  previousAssignment: AssignmentDetails
  scrollTo: (code: string) => void
}

const ReviewSubmit: React.FC<ReviewSubmitProps> = (props) => {
  const {
    structure: { thisReview, assignment, isInteractive },
    previousAssignment,
  } = props

  const reviewDecision = thisReview?.reviewDecision
  const { decisionOptions, getDecision, setDecision, getAndSetDecisionError, isDecisionError } =
    useGetDecisionOptions(isInteractive, assignment, thisReview)

  return (
    <Form id="review-submit-area">
      <ReviewDecision
        decisionOptions={decisionOptions}
        setDecision={setDecision}
        isDecisionError={isDecisionError}
        isEditable={thisReview?.current.reviewStatus === ReviewStatus.Draft}
      />
      <ReviewComment
        isEditable={thisReview?.current.reviewStatus === ReviewStatus.Draft}
        reviewDecisionId={reviewDecision?.id}
      />
      <ReviewSubmitButton
        {...props}
        getDecision={getDecision}
        getAndSetDecisionError={getAndSetDecisionError}
      />
    </Form>
  )
}

type ReviewSubmitButtonProps = {
  getDecision: () => Decision
  getAndSetDecisionError: () => boolean
}

const ReviewSubmitButton: React.FC<ReviewSubmitProps & ReviewSubmitButtonProps> = ({
  scrollTo,
  structure,
  getDecision,
  getAndSetDecisionError,
  assignment,
  previousAssignment,
}) => {
  const { strings } = useLanguageProvider()
  const {
    location: { pathname },
    replace,
    push,
  } = useRouter()

  const messages = {
    REVIEW_SUBMISSION_CONFIRM: {
      title: strings.REVIEW_SUBMISSION_CONFIRM_TITLE,
      message: strings.REVIEW_SUBMISSION_CONFIRM_MESSAGE,
      option: strings.BUTTON_SUBMIT,
    },
    REVIEW_DECISION_SET_FAIL: {
      title: strings.REVIEW_DECISION_SET_FAIL_TITLE,
      message: strings.REVIEW_DECISION_SET_FAIL_MESSAGE,
      option: strings.OK,
    },
    REVIEW_DECISION_MISMATCH: {
      title: strings.REVIEW_DECISION_MISMATCH_TITLE,
      message: strings.REVIEW_DECISION_MISMATCH_MESSAGE,
      option: strings.OK,
    },
    REVIEW_STATUS_PENDING: {
      title: strings.REVIEW_STATUS_PENDING_TITLE,
      message: strings.REVIEW_STATUS_PENDING_MESSAGE,
      option: strings.OK,
    },
  }

  // Need to refetch review status before submission, in case it's pending
  const getFullReviewStructureAsync = useGetFullReviewStructureAsync({
    fullApplicationStructure: structure,
    reviewAssignment: assignment,
  })

  const [showModalConfirmation, setShowModalConfirmation] = useState<ModalProps>({ open: false })
  const [showWarningModal, setShowWarningModal] = useState<ModalProps>({ open: false })
  // TODO: Show on message
  const [submissionError, setSubmissionError] = useState<boolean>(false)
  const submitReview = useSubmitReview(Number(structure.thisReview?.id))
  const setAttemptSubmission = () => (structure.attemptSubmission = true)
  const attemptSubmissionFailed = structure.attemptSubmission && structure.firstIncompleteReviewPage

  const showIncompleteSectionWarning = () => {
    const { title, message, option } = messages.REVIEW_DECISION_SET_FAIL
    setShowWarningModal({
      open: true,
      title,
      message,
      option,
      onClick: () => setShowWarningModal({ open: false }),
      onClose: () => setShowWarningModal({ open: false }),
    })
  }

  const showPendingReviewWarning = () => {
    const { title, message, option } = messages.REVIEW_STATUS_PENDING
    setShowWarningModal({
      open: true,
      title,
      message,
      option,
      onClick: () => {
        setShowWarningModal({ open: false })
        push(`/application/${structure.info.serial}/review`)
      },
      onClose: () => {
        setShowWarningModal({ open: false })
        push(`/application/${structure.info.serial}/review`)
      },
    })
  }

  const showDecisionMismatchWarning = () => {
    const { title, message, option } = messages.REVIEW_DECISION_MISMATCH
    setShowWarningModal({
      open: true,
      title,
      message,
      option,
      onClick: () => submission(),
      onClose: () => setShowWarningModal({ open: false }),
    })
  }

  const showConfirmation = () => {
    const { title, message, option } = messages.REVIEW_SUBMISSION_CONFIRM
    setShowModalConfirmation({
      open: true,
      title,
      message,
      option,
      onClick: () => submission(),
      onClose: () => setShowModalConfirmation({ open: false }),
    })
  }

  const onClick = async () => {
    const firstIncompleteReviewPage = structure.firstIncompleteReviewPage

    // Check INCOMPLETE
    if (firstIncompleteReviewPage) {
      const { sectionCode, pageNumber } = firstIncompleteReviewPage

      replace(`${pathname}?activeSections=${sectionCode}`)
      scrollTo(`${sectionCode}P${pageNumber}`)
      setAttemptSubmission()
      return
    }

    // Check DECISION was made
    const decisionError = getAndSetDecisionError()
    if (decisionError) {
      showIncompleteSectionWarning()
      return
    }

    // Check (consolidator) review status != PENDING
    const { thisReview } = await getFullReviewStructureAsync()
    if (thisReview?.current.reviewStatus === ReviewStatus.Pending) {
      showPendingReviewWarning()
      return
    }

    // Check MISMATCH previous (when is Final Decision)
    if (
      assignment.isFinalDecision &&
      !!previousAssignment &&
      previousAssignment.review?.reviewDecision?.decision !== getDecision()
    ) {
      // Should submit when user clicks OK
      showDecisionMismatchWarning()
      return
    }

    // Can SUBMIT
    showConfirmation()
  }

  const submission = async () => {
    try {
      await submitReview(structure, getDecision())
    } catch (e) {
      console.log(e)
      setShowModalConfirmation({ open: false })
      setSubmissionError(true)
    }
  }

  if (structure.thisReview?.current.reviewStatus !== ReviewStatus.Draft) return null

  return (
    <Form.Field>
      <Button
        primary
        className={attemptSubmissionFailed ? 'alert wide-button' : 'wide-button'}
        onClick={() => onClick()}
        content={strings.BUTTON_REVIEW_SUBMIT}
      />
      {attemptSubmissionFailed && (
        <Label className="simple-label alert-text" content={strings.REVIEW_SUBMISSION_FAIL} />
      )}
      <ModalWarning {...showWarningModal} />
      <ModalConfirmation {...showModalConfirmation} />
    </Form.Field>
  )
}
export default ReviewSubmit
