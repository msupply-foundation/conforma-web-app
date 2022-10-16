import React, { useState } from 'react'
import { Button, Form, Label } from 'semantic-ui-react'
import useConfirmationModal from '../../utils/hooks/useConfirmationModal'
import ReviewComment from '../../components/Review/ReviewComment'
import ReviewDecision from '../../components/Review/ReviewDecision'
import {
  Decision,
  ReviewStatus,
  useGetReviewableQuestionsQuery,
} from '../../utils/generated/graphql'
import useGetDecisionOptions from '../../utils/hooks/useGetDecisionOptions'
import { useGetFullReviewStructureAsync } from '../../utils/hooks/useGetReviewStructureForSection'
import { useRouter } from '../../utils/hooks/useRouter'
import useSubmitReview from '../../utils/hooks/useSubmitReview'
import { ReviewDecisionPreview } from '../../components/Review/DecisionPreview/ReviewDecisionPreview'
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
    structure: { info, thisReview, assignment, canApplicantMakeChanges },
  } = props

  const { data } = useGetReviewableQuestionsQuery({
    variables: {
      applicationId: info.id,
      stageId: thisReview?.current.stage.id as number,
      levelNumber: assignment?.assigneeLevel as number,
    },
  })
  const reviewDecision = thisReview?.reviewDecision
  const { decisionOptions, getDecision, setDecision, getAndSetDecisionError, isDecisionError } =
    useGetDecisionOptions(canApplicantMakeChanges, assignment, thisReview)

  if (!data) return null

  const { assignedQuestions, reviewableQuestions } = data
  const fullyAssigned = assignedQuestions?.totalCount === reviewableQuestions?.totalCount

  return (
    <Form id="review-submit-area">
      <div className="flex-row-space-between-flex-end">
        <ReviewDecision
          decisionOptions={decisionOptions}
          setDecision={setDecision}
          isDecisionError={isDecisionError}
          isEditable={thisReview?.current.reviewStatus === ReviewStatus.Draft}
        />
        <ReviewDecisionPreview structure={props.structure} decision={getDecision()} />
      </div>
      <ReviewComment
        isEditable={thisReview?.current.reviewStatus === ReviewStatus.Draft}
        reviewDecisionId={reviewDecision?.id}
      />
      <ReviewSubmitButton
        {...props}
        getDecision={getDecision}
        getAndSetDecisionError={getAndSetDecisionError}
        fullyAssigned={fullyAssigned}
      />
    </Form>
  )
}

type ReviewSubmitButtonProps = {
  getDecision: () => Decision
  getAndSetDecisionError: () => boolean
  fullyAssigned: boolean
}

const ReviewSubmitButton: React.FC<ReviewSubmitProps & ReviewSubmitButtonProps> = ({
  scrollTo,
  structure,
  getDecision,
  getAndSetDecisionError,
  fullyAssigned,
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
      confirmText: strings.BUTTON_SUBMIT,
    },
    REVIEW_SUBMISSION_INCOMPLETE: {
      title: strings.REVIEW_SUBMISSION_CONFIRM_TITLE,
      message: strings.REVIEW_SUBMISSION_INCOMPLETE_MESSAGE,
      confirmText: strings.BUTTON_SUBMIT,
    },
    REVIEW_DECISION_SET_FAIL: {
      title: strings.REVIEW_DECISION_SET_FAIL_TITLE,
      message: strings.REVIEW_DECISION_SET_FAIL_MESSAGE,
    },
    REVIEW_DECISION_MISMATCH: {
      title: strings.REVIEW_DECISION_MISMATCH_TITLE,
      message: strings.REVIEW_DECISION_MISMATCH_MESSAGE,
    },
    REVIEW_STATUS_PENDING: {
      title: strings.REVIEW_STATUS_PENDING_TITLE,
      message: strings.REVIEW_STATUS_PENDING_MESSAGE,
    },
  }

  // Need to refetch review status before submission, in case it's pending
  const getFullReviewStructureAsync = useGetFullReviewStructureAsync({
    reviewStructure: structure,
    reviewAssignment: assignment,
  })

  const { ConfirmModal, showModal: showConfirmModal } = useConfirmationModal({
    onConfirm: () => submission(),
  })
  const { ConfirmModal: WarningModal, showModal: showWarning } = useConfirmationModal({
    type: 'warning',
  })
  // TODO: Show on message
  const [submissionError, setSubmissionError] = useState<boolean>(false)
  const submitReview = useSubmitReview(Number(structure.thisReview?.id), structure.reload)
  const setAttemptSubmission = () => (structure.attemptSubmission = true)
  const attemptSubmissionFailed = structure.attemptSubmission && structure.firstIncompleteReviewPage

  const showIncompleteSectionWarning = () => {
    showWarning({ ...messages.REVIEW_DECISION_SET_FAIL })
  }

  const showPendingReviewWarning = () => {
    showWarning({
      ...messages.REVIEW_STATUS_PENDING,
      onConfirm: () => push(`/application/${structure.info.serial}/review`),
      onCancel: () => push(`/application/${structure.info.serial}/review`),
    })
  }

  const showDecisionMismatchWarning = () => {
    showWarning({ ...messages.REVIEW_DECISION_MISMATCH, onConfirm: () => submission() })
  }

  const onClick = async () => {
    const firstIncompleteReviewPage = assignment.isFinalDecision
      ? null
      : structure.firstIncompleteReviewPage

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

    // Can SUBMIT, but review isn't completed
    if (!fullyAssigned) {
      showConfirmModal({
        ...messages.REVIEW_SUBMISSION_INCOMPLETE,
      })
    }

    // Can SUBMIT
    showConfirmModal({ ...messages.REVIEW_SUBMISSION_CONFIRM })
  }

  const submission = async () => {
    try {
      await submitReview(structure, getDecision())
    } catch (e) {
      console.log(e)
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
      <WarningModal />
      <ConfirmModal />
    </Form.Field>
  )
}
export default ReviewSubmit
