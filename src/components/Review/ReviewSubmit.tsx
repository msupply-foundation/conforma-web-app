import React, { useState } from 'react'
import { Button, Checkbox, Form, ModalProps, TextArea } from 'semantic-ui-react'
import { ModalWarning } from '..'
import strings from '../../utils/constants'
import { Decision, ReviewStatus } from '../../utils/generated/graphql'
import { useRouter } from '../../utils/hooks/useRouter'

import messages from '../../utils/messages'
import { AssignmentDetailsNEW, FullStructure } from '../../utils/types'
import useGetDecisionOptions, { DecisionOption } from './hooks/useGetDecisionOptions'
import useSubmitReview from './hooks/useSubmitReview'
import useUpdateReviewDecisionComment from './hooks/useUpdateReviewDecisionComment'

type ReviewSubmitProps = {
  structure: FullStructure
  reviewAssignment: AssignmentDetailsNEW
  scrollTo: (code: string) => void
}

const ReviewSubmit: React.FC<ReviewSubmitProps> = (props) => {
  const { structure } = props
  const thisReview = structure?.thisReview
  const reviewDecision = thisReview?.reviewDecision
  const {
    decisionOptions,
    getDecision,
    setDecision,
    getAndSetDecisionError,
    isDecisionError,
  } = useGetDecisionOptions(structure.canSubmitReviewAs, thisReview)

  return (
    <>
      {
        <ReviewComment
          isEditable={thisReview?.status == ReviewStatus.Draft}
          initialComment={reviewDecision?.comment || ''}
          reviewDecisionId={Number(reviewDecision?.id)}
        />
      }
      <ReviewDecision
        decisionOptions={decisionOptions}
        setDecision={setDecision}
        isDecisionError={isDecisionError}
      />
      <ReviewSubmitButton
        {...props}
        getDecision={getDecision}
        getAndSetDecisionError={getAndSetDecisionError}
      />
    </>
  )
}

type ReviewCommentProps = {
  initialComment: string
  reviewDecisionId: number
  isEditable: boolean
}

const ReviewComment: React.FC<ReviewCommentProps> = ({
  reviewDecisionId,
  initialComment,
  isEditable,
}) => {
  const submitComment = useUpdateReviewDecisionComment(reviewDecisionId)
  const [comment, setComment] = useState(initialComment)

  if (!isEditable) return <p>{comment}</p>

  return (
    <Form>
      <TextArea
        defaultValue={initialComment}
        onChange={(_, { value }) => setComment(String(value))}
        onBlur={() => submitComment(comment)}
      />
    </Form>
  )
}

type ReviewDecisionProps = {
  decisionOptions: DecisionOption[]
  setDecision: (decision: Decision) => void
  isDecisionError: boolean
}

const ReviewDecision: React.FC<ReviewDecisionProps> = ({
  decisionOptions,
  setDecision,
  isDecisionError,
}) => {
  console.log({ isDecisionError })
  return (
    <Form>
      {decisionOptions
        .filter((option) => option.isVisible)
        .map((option) => (
          <Form.Field error={isDecisionError} key={option.code}>
            <Checkbox
              radio
              label={option.title}
              name={option.title}
              value={option.code}
              checked={option.value}
              onChange={() => setDecision(option.code)}
            />
          </Form.Field>
        ))}
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
  reviewAssignment,
  getDecision,
  getAndSetDecisionError,
}) => {
  const {
    location: { pathname },
    replace,
  } = useRouter()

  const [showWarningModal, setShowWarningModal] = useState<ModalProps>({ open: false })
  const submitReview = useSubmitReview(Number(structure.thisReview?.id))

  const showWarning = (message: {}, action: () => void) => {
    setShowWarningModal({
      open: true,
      ...message,
      onClick: () => {
        setShowWarningModal({ open: false })
        action()
      },
      onClose: () => setShowWarningModal({ open: false }),
    })
  }

  const onClick = () => {
    const firstIncompleteReviewPage = structure.firstIncompleteReviewPage

    // Check INCOMPLETE
    if (firstIncompleteReviewPage) {
      const { sectionCode, pageNumber } = firstIncompleteReviewPage

      replace(`${pathname}?activeSections=${sectionCode}`)

      // TODO add consolidator submission error
      const message = reviewAssignment.level === 1 ? messages.REVIEW_LEVEL1_SUBMISSION_FAIL : {}
      showWarning(message, () => scrollTo(`${sectionCode}P${pageNumber}`))
      return
    }

    // Check DECISION was made
    const decisionError = getAndSetDecisionError()
    console.log({ decisionError })
    if (decisionError) {
      const message = messages.REVIEW_DECISION_SET_FAIL
      showWarning(message, () => {})
      return
    }

    // Can SUBMIT
    /* TODO add submission modal, currently will submit even if ok is not pressed, also deal with localisation at the same time */
    const message = {
      title: 'Submitting Review',
      message: 'Are you sure',
      option: 'SUBMIT',
    }

    const action = async () => {
      try {
        await submitReview(structure, getDecision())
      } catch (e) {
        // TODO handle in UI
        console.log('Update review mutation failed', e)
      }
    }

    showWarning(message, action)
  }

  if (structure.thisReview?.status !== ReviewStatus.Draft) {
    return (
      <>
        <Button onClick={() => console.log('go to view submissions')}>
          {strings.BUTTON_REVIEW_VIEW_SUBMISSION}
        </Button>
      </>
    )
  }

  return (
    <>
      <Button onClick={onClick}>{strings.BUTTON_REVIEW_SUBMIT}</Button>
      <ModalWarning showModal={showWarningModal} />
      {/* TODO add submission modal */}
    </>
  )
}

export default ReviewSubmit
