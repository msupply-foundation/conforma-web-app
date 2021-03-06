import React, { useState } from 'react'
import { Button, ModalProps } from 'semantic-ui-react'
import { ModalWarning } from '..'
import strings from '../../utils/constants'
import { ReviewResponse, ReviewStatus } from '../../utils/generated/graphql'
import { useRouter } from '../../utils/hooks/useRouter'
import useSubmitReview from '../../utils/hooks/useSubmitReview'
import messages from '../../utils/messages'
import { AssignmentDetailsNEW, FullStructure } from '../../utils/types'

const ReviewSubmitButton: React.FC<{
  structure: FullStructure
  reviewAssignment: AssignmentDetailsNEW
  scrollTo: (code: string) => void
}> = ({ scrollTo, structure, reviewAssignment }) => {
  const {
    location: { pathname },
    replace,
  } = useRouter()

  const [showWarningModal, setShowWarningModal] = useState<ModalProps>({ open: false })
  const [showSubmissionModal, setShowSubmissionModal] = useState<ModalProps>({ open: false })
  const { submit } = useSubmitReview({ reviewId: reviewAssignment?.review?.id as number })

  const firstIncompleteReviewPage = structure.firstIncompleteReviewPage

  const onClick = () => {
    if (firstIncompleteReviewPage) {
      const { sectionCode, pageNumber } = firstIncompleteReviewPage
      // TODO add consolidator submission error
      const modalContent =
        reviewAssignment.level === 1 ? messages.REVIEW_LEVEL1_SUBMISSION_FAIL : {}

      replace(`${pathname}?activeSections=${sectionCode}`)

      setShowWarningModal({
        open: true,
        ...modalContent,
        onClick: () => {
          setShowWarningModal({ open: false })
          scrollTo(`${sectionCode}P${pageNumber}`)
        },
        onClose: () => setShowWarningModal({ open: false }),
      })
      return
    }

    // Review can be submitted
    /* TODO add submission modal */
    setShowSubmissionModal({
      open: true,
      title: 'Submitting Review',
      message: 'Are you sure',
      option: 'SUBMIT',
      onClick: () => {
        setShowSubmissionModal({ open: false })

        const pages = Object.values(structure.sections)
          .map((section) => Object.values(section.pages))
          .flat()
        const reviewResponses = pages
          .map((page) =>
            page.state.map((pageState) => pageState.thisReviewLatestResponse as ReviewResponse)
          )
          .flat()
          .filter((reviewResponse) => reviewResponse)

        submit(
          reviewResponses.map(({ id, decision, comment }) => ({
            id,
            decision,
            comment,
          }))
        )
      },
      onClose: () => setShowSubmissionModal({ open: false }),
    })
  }

  if (reviewAssignment?.review?.status !== ReviewStatus.Draft) return null
  return (
    <>
      <Button onClick={onClick}>{strings.BUTTON_REVIEW_SUBMIT}</Button>
      <ModalWarning showModal={showWarningModal} />
      {/* TODO add submission modal */}
      <ModalWarning showModal={showSubmissionModal} />
    </>
  )
}

export default ReviewSubmitButton
