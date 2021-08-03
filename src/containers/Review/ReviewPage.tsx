import React, { useState } from 'react'
import { Button, Header, Icon, Label, Message, ModalProps, Segment } from 'semantic-ui-react'
import {
  Loading,
  ConsolidationSectionProgressBar,
  ReviewHeader,
  ReviewInProgressLabel,
  ReviewSectionProgressBar,
  SectionWrapper,
  ModalWarning,
} from '../../components'
import { ReviewByLabel, ConsolidationByLabel } from '../../components/Review/ReviewLabel'
import ReviewComment from '../../components/Review/ReviewComment'
import {
  AssignmentDetails,
  FullStructure,
  Page,
  ResponsesByCode,
  ReviewDetails,
  SectionAssignment,
  SectionState,
} from '../../utils/types'
import {
  ReviewResponseDecision,
  ReviewResponseStatus,
  ReviewStatus,
  useUpdateReviewResponseMutation,
} from '../../utils/generated/graphql'
import strings from '../../utils/constants'
import useGetReviewStructureForSections from '../../utils/hooks/useGetReviewStructureForSection'
import useQuerySectionActivation from '../../utils/hooks/useQuerySectionActivation'
import useScrollableAttachments, {
  ScrollableAttachment,
} from '../../utils/hooks/useScrollableAttachments'
import ReviewSubmit from './ReviewSubmit'
import { useUserState } from '../../contexts/UserState'
import { useRouter } from '../../utils/hooks/useRouter'
import messages from '../../utils/messages'
import { Link } from 'react-router-dom'

const ReviewPage: React.FC<{
  reviewAssignment: AssignmentDetails
  previousAssignment: AssignmentDetails
  fullApplicationStructure: FullStructure
}> = ({ reviewAssignment, previousAssignment, fullApplicationStructure }) => {
  const {
    userState: { currentUser },
  } = useUserState()

  const { push } = useRouter()

  const { fullReviewStructure, error } = useGetReviewStructureForSections({
    reviewAssignment,
    fullApplicationStructure,
  })

  const { isSectionActive, toggleSection } = useQuerySectionActivation({
    defaultActiveSectionCodes: [],
  })

  const { addScrollable, scrollTo } = useScrollableAttachments()

  const [showWarningModal, setShowWarningModal] = useState<ModalProps>({ open: false })

  if (error) return <Message error title={strings.ERROR_GENERIC} list={[error]} />
  if (!fullReviewStructure) return <Loading />

  // TODO decide how to handle this, and localise if not deleted
  if (
    reviewAssignment?.reviewer?.id !== currentUser?.userId &&
    fullReviewStructure?.thisReview?.current.reviewStatus !== ReviewStatus.Submitted
  ) {
    const {
      info: {
        name,
        current: { stage },
      },
    } = fullReviewStructure
    return (
      <>
        <ReviewHeader applicationName={name} stage={stage} />
        <Label className="simple-label" content={strings.LABEL_REVIEW_IN_PROGRESS} />
      </>
    )
  }

  const {
    sections,
    responsesByCode,
    info: {
      serial,
      name,
      current: { stage },
    },
    thisReview,
    attemptSubmission,
    firstIncompleteReviewPage,
  } = fullReviewStructure

  if (
    thisReview?.current.reviewStatus === ReviewStatus.Pending &&
    showWarningModal.open === false
  ) {
    const { title, message, option } = messages.REVIEW_STATUS_PENDING
    setShowWarningModal({
      open: true,
      title,
      message,
      option,
      onClick: () => {
        setShowWarningModal({ open: false })
        push(`/application/${fullReviewStructure.info.serial}/review`)
      },
      onClose: () => {
        setShowWarningModal({ open: false })
        push(`/application/${fullReviewStructure.info.serial}/review`)
      },
    })
  }

  const isMissingReviewResponses = (section: string): boolean =>
    attemptSubmission && firstIncompleteReviewPage?.sectionCode === section

  const isAssignedToCurrentUser = Object.values(sections).some(
    (section) => section.assignment?.isAssignedToCurrentUser
  )

  const isConsolidation = Object.values(sections).some(
    (section) => section.assignment?.isConsolidation
  )

  return error ? (
    <Message error title={strings.ERROR_GENERIC} list={[error]} />
  ) : (
    <>
      <ReviewHeader applicationName={name} stage={stage} />
      <div style={{ display: 'flex' }}>
        {isConsolidation ? (
          isAssignedToCurrentUser ? (
            <ConsolidationByLabel />
          ) : (
            <ConsolidationByLabel user={thisReview?.reviewer} />
          )
        ) : isAssignedToCurrentUser ? (
          <ReviewByLabel />
        ) : (
          <ReviewByLabel user={thisReview?.reviewer} />
        )}
      </div>
      <div id="application-summary-content">
        {Object.values(sections).map((section) => (
          <SectionWrapper
            key={`ApplicationSection_${section.details.id}`}
            isActive={isSectionActive(section.details.code)}
            toggleSection={toggleSection(section.details.code)}
            section={section}
            isSectionInvalid={isMissingReviewResponses(section.details.code)}
            extraSectionTitleContent={(section: SectionState) => (
              <div>
                {isMissingReviewResponses(section.details.code) && (
                  <Label
                    icon={<Icon name="exclamation circle" color="pink" />}
                    className="simple-label alert-text"
                    content={strings.LABEL_REVIEW_SECTION}
                  />
                )}
                <SectionRowStatus {...section} />
              </div>
            )}
            extraPageContent={(page: Page) => (
              <ApproveAllButton
                isConsolidation={!!section.assignment?.isConsolidation}
                stageNumber={stage.number}
                page={page}
              />
            )}
            scrollableAttachment={(page: Page) => (
              <ScrollableAttachment
                code={`${section.details.code}P${page.number}`}
                addScrollabe={addScrollable}
              />
            )}
            responsesByCode={responsesByCode as ResponsesByCode}
            applicationData={fullApplicationStructure.info}
            stages={fullApplicationStructure.stages}
            serial={serial}
            isReview
            isConsolidation={section.assignment?.isConsolidation}
            canEdit={
              reviewAssignment?.review?.current.reviewStatus === ReviewStatus.Draft ||
              reviewAssignment?.review?.current.reviewStatus === ReviewStatus.Locked
            }
          />
        ))}
        <PreviousStageDecision
          isFinalDecision={reviewAssignment.isFinalDecision}
          review={previousAssignment.review}
          serial={serial}
        />
        <ReviewSubmit
          structure={fullReviewStructure}
          assignment={reviewAssignment}
          previousAssignment={previousAssignment}
          scrollTo={scrollTo}
        />
      </div>
      <ModalWarning {...showWarningModal} />
    </>
  )
}

const SectionRowStatus: React.FC<SectionState> = (section) => {
  const { assignment, reviewProgress, consolidationProgress } = section
  const { isConsolidation, isReviewable, isAssignedToCurrentUser } = assignment as SectionAssignment

  if (isReviewable) {
    if (!isAssignedToCurrentUser)
      return <Label className="simple-label" content={strings.LABEL_ASSIGNED_TO_OTHER} />
    if (isConsolidation) {
      const totalDone =
        (consolidationProgress?.totalConform || 0) + (consolidationProgress?.totalNonConform || 0)
      if (totalDone > 0)
        return <ConsolidationSectionProgressBar consolidationProgress={consolidationProgress} />
    } else {
      const totalDone = (reviewProgress?.doneConform || 0) + (reviewProgress?.doneNonConform || 0)
      if (totalDone > 0) return <ReviewSectionProgressBar reviewProgress={reviewProgress} />
    }
    return <ReviewInProgressLabel />
  }
  // else: not reviewable
  return null
}

interface ApproveAllButtonProps {
  isConsolidation: boolean
  stageNumber: number
  page: Page
}

const ApproveAllButton: React.FC<ApproveAllButtonProps> = ({
  isConsolidation,
  stageNumber,
  page,
}) => {
  const [updateReviewResponse] = useUpdateReviewResponseMutation()

  const reviewResponses = page.state.map((element) => element.thisReviewLatestResponse)

  const responsesToReview = reviewResponses.filter(
    (reviewResponse) =>
      reviewResponse &&
      !reviewResponse?.decision &&
      // Prevention to count reviewResponse without linked application OR another review
      (!!reviewResponse.applicationResponseId || !!reviewResponse.reviewResponseLinkId)
  )

  const massApprove = () => {
    responsesToReview.forEach((reviewResponse) => {
      if (!reviewResponse) return
      updateReviewResponse({
        variables: {
          id: reviewResponse.id,
          decision: isConsolidation ? ReviewResponseDecision.Agree : ReviewResponseDecision.Approve,
          stageNumber,
        },
      })
    })
  }

  if (responsesToReview.length === 0) return null
  if (responsesToReview.some((response) => response?.status !== ReviewResponseStatus.Draft))
    return null

  return (
    <div className="right-justify-content review-approve-all-button">
      <Button
        primary
        inverted
        onClick={massApprove}
        content={`${
          isConsolidation ? strings.BUTTON_REVIEW_AGREE_ALL : strings.BUTTON_REVIEW_APPROVE_ALL
        } (${responsesToReview.length})`}
      />
    </div>
  )
}

interface PreviousStageDecisionProps {
  review?: ReviewDetails | null
  isFinalDecision: boolean
  serial: string
}

const PreviousStageDecision: React.FC<PreviousStageDecisionProps> = ({
  review,
  isFinalDecision,
  serial,
}) =>
  isFinalDecision && !!review ? (
    <Segment.Group horizontal>
      <Segment>
        <Header as="h3">{strings.LABEL_PREVIOUS_REVIEW}:</Header>
        <Link className="user-action" to={`/application/${serial}/review/${review.id}`}>
          {strings.ACTION_VIEW}
        </Link>
        <ReviewByLabel user={review.reviewer} />
      </Segment>
      {!!review.reviewDecision?.decision && (
        <Segment>
          <p>
            <strong>{strings.LABEL_REVIEW_SUBMITED_AS}:</strong>
          </p>
          {strings[review.reviewDecision.decision]}
        </Segment>
      )}
      {review.reviewDecision?.comment !== '' && (
        <Segment>
          <ReviewComment reviewDecisionId={review?.reviewDecision?.id} isEditable={false} />
        </Segment>
      )}
    </Segment.Group>
  ) : null

export default ReviewPage
