import React, { useEffect } from 'react'
import { Button, Header, Icon, Label, Message, Segment } from 'semantic-ui-react'
import {
  Loading,
  ConsolidationSectionProgressBar,
  ReviewHeader,
  ReviewInProgressLabel,
  ReviewSectionProgressBar,
  SectionWrapper,
} from '../../components'
import useConfirmationModal from '../../utils/hooks/useConfirmationModal'
import {
  ReviewByLabel,
  ConsolidationByLabel,
  ReviewLockedLabel,
} from '../../components/Review/ReviewLabel'
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
} from '../../utils/generated/graphql'
import { useLanguageProvider } from '../../contexts/Localisation'
import useLocalisedEnums from '../../utils/hooks/useLocalisedEnums'
import useGetReviewStructureForSections from '../../utils/hooks/useGetReviewStructureForSection'
import useQuerySectionActivation from '../../utils/hooks/useQuerySectionActivation'
import useScrollableAttachments, {
  ScrollableAttachment,
} from '../../utils/hooks/useScrollableAttachments'
import ReviewSubmit from './ReviewSubmit'
import { useUserState } from '../../contexts/UserState'
import { useRouter } from '../../utils/hooks/useRouter'
import { Link } from 'react-router-dom'
import useUpdateReviewResponse from '../../utils/hooks/useUpdateReviewResponse'

const ReviewPage: React.FC<{
  reviewAssignment: AssignmentDetails
  previousAssignment: AssignmentDetails
  fullApplicationStructure: FullStructure
}> = ({ reviewAssignment, previousAssignment, fullApplicationStructure }) => {
  const { strings } = useLanguageProvider()
  const { serial } = fullApplicationStructure.info
  const {
    userState: { currentUser },
  } = useUserState()

  const { push } = useRouter()

  const { reviewStructure, error } = useGetReviewStructureForSections({
    reviewAssignment,
    reviewStructure: fullApplicationStructure,
  })

  const reviewStatus = reviewStructure?.thisReview?.current.reviewStatus ?? ReviewStatus.Submitted

  const { isSectionActive, toggleSection } = useQuerySectionActivation({
    defaultActiveSectionCodes: [],
    allSections: Object.keys(fullApplicationStructure.sections),
  })

  const { addScrollable, scrollTo } = useScrollableAttachments()

  const { ConfirmModal: WarningModal, showModal: showWarningModal } = useConfirmationModal({
    type: 'warning',
    onConfirm: () => push(`/application/${serial}/review`),
    showCancel: false,
  })

  useEffect(() => {
    if (reviewStatus === ReviewStatus.Pending)
      showWarningModal({
        title: strings.REVIEW_STATUS_PENDING_TITLE,
        message: strings.REVIEW_STATUS_PENDING_MESSAGE,
      })
    else if (reviewStatus === ReviewStatus.Discontinued)
      showWarningModal({
        title: strings.REVIEW_STATUS_DISCONTINUED_TITLE,
        message: strings.REVIEW_STATUS_DISCONTINUED_MESSAGE,
      })
  }, [reviewStructure])

  if (error) return <Message error title={strings.ERROR_GENERIC} list={[error]} />
  if (!reviewStructure) return <Loading />

  if (
    reviewAssignment?.reviewer?.id !== currentUser?.userId &&
    reviewStructure?.thisReview?.current.reviewStatus !== ReviewStatus.Submitted &&
    reviewStructure?.thisReview?.current.reviewStatus !== ReviewStatus.Discontinued
  ) {
    const {
      info: { name },
    } = reviewStructure

    return (
      <>
        <ReviewHeader applicationName={name} stage={reviewAssignment.current.stage} />
        <Label className="simple-label" content={strings.LABEL_REVIEW_IN_PROGRESS} />
      </>
    )
  }

  const {
    sections,
    responsesByCode,
    info: { name },
    thisReview,
    attemptSubmission,
    firstIncompleteReviewPage,
  } = reviewStructure

  const isMissingReviewResponses = (section: string): boolean =>
    attemptSubmission && firstIncompleteReviewPage?.sectionCode === section

  const isAssignedToCurrentUser = Object.values(sections).some(
    (section) => section.assignment?.isAssignedToCurrentUser
  )

  const isConsolidation = Object.values(sections).some(
    (section) => section.assignment?.isConsolidation
  )

  const isSubmitted =
    thisReview?.current.reviewStatus === ReviewStatus.Submitted ||
    thisReview?.current.reviewStatus === ReviewStatus.ChangesRequested
  const isLocked = thisReview?.isLocked

  const canEdit = (sectionCode: string) =>
    reviewAssignment?.assignedSections.includes(sectionCode) &&
    reviewAssignment?.review?.current.reviewStatus === ReviewStatus.Draft

  const ReviewSubheader: React.FC = () =>
    isLocked ? (
      <ReviewLockedLabel
        reviewer={isAssignedToCurrentUser ? undefined : thisReview?.reviewer}
        strings={strings}
      />
    ) : isConsolidation ? (
      <ConsolidationByLabel
        isSubmitted={isSubmitted}
        user={isAssignedToCurrentUser ? undefined : thisReview?.reviewer}
        strings={strings}
      />
    ) : (
      <ReviewByLabel
        isSubmitted={isSubmitted}
        user={isAssignedToCurrentUser ? undefined : thisReview?.reviewer}
        strings={strings}
      />
    )

  return error ? (
    <Message error title={strings.ERROR_GENERIC} list={[error]} />
  ) : (
    <>
      <ReviewHeader applicationName={name} stage={reviewAssignment.current.stage} />
      <ReviewSubheader />
      <div id="application-summary-content">
        {Object.values(sections)
          .filter(({ details }) => details.active)
          .map((section) => (
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
              extraPageContent={(page: Page) =>
                canEdit(section.details.code) && (
                  <ApproveAllButton
                    isConsolidation={!!section.assignment?.isConsolidation}
                    page={page}
                  />
                )
              }
              scrollableAttachment={(page: Page) => (
                <ScrollableAttachment
                  code={`${section.details.code}P${page.number}`}
                  addScrollabe={addScrollable}
                />
              )}
              responsesByCode={responsesByCode as ResponsesByCode}
              applicationData={reviewStructure.info}
              stages={reviewStructure.stages.map(({ stage }) => stage)}
              serial={serial}
              reviewInfo={thisReview}
              isConsolidation={section.assignment?.isConsolidation}
              canEdit={canEdit(section.details.code)}
            />
          ))}
        <PreviousStageDecision
          isFinalDecision={reviewAssignment.isFinalDecision}
          review={previousAssignment?.review}
          serial={serial}
        />
        <ReviewSubmit
          structure={reviewStructure}
          assignment={reviewAssignment}
          previousAssignment={previousAssignment}
          scrollTo={scrollTo}
        />
      </div>
      <WarningModal />
    </>
  )
}

const SectionRowStatus: React.FC<SectionState> = (section) => {
  const { strings } = useLanguageProvider()
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
    return <ReviewInProgressLabel strings={strings} />
  }
  // else: not reviewable
  return null
}

interface ApproveAllButtonProps {
  isConsolidation: boolean
  page: Page
}

const ApproveAllButton: React.FC<ApproveAllButtonProps> = ({ isConsolidation, page }) => {
  const { strings } = useLanguageProvider()
  const updateReviewResponse = useUpdateReviewResponse()

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
      if (reviewResponse)
        updateReviewResponse({
          ...reviewResponse,
          decision: isConsolidation ? ReviewResponseDecision.Agree : ReviewResponseDecision.Approve,
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
  review: ReviewDetails | null | undefined
  isFinalDecision: boolean
  serial: string
}

const PreviousStageDecision: React.FC<PreviousStageDecisionProps> = ({
  review,
  isFinalDecision,
  serial,
}) => {
  const { strings } = useLanguageProvider()
  const { Decision } = useLocalisedEnums()
  return isFinalDecision && !!review ? (
    <Segment.Group horizontal id="previous-review">
      <Segment>
        <Header as="h3">{strings.LABEL_PREVIOUS_REVIEW}:</Header>
        <ReviewByLabel user={review.reviewer} isSubmitted={true} strings={strings} />
        <Button
          className="button-med"
          as={Link}
          to={`/application/${serial}/review/${review.id}`}
          target="_blank"
          content={strings.ACTION_VIEW}
        />
      </Segment>
      {!!review.reviewDecision?.decision && (
        <Segment>
          <p style={{ width: '150px' }}>
            <strong>{strings.LABEL_REVIEW_SUBMITTED_AS}:</strong>
          </p>
          {Decision[review.reviewDecision.decision]}
        </Segment>
      )}
      {!review?.reviewDecision?.comment && review.reviewDecision?.comment !== '' && (
        <Segment>
          <ReviewComment reviewDecisionId={review?.reviewDecision?.id} isEditable={false} />
        </Segment>
      )}
    </Segment.Group>
  ) : null
}

export default ReviewPage
