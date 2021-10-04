import React, { useEffect, useState } from 'react'
import { Grid, Icon, Label, Message } from 'semantic-ui-react'
import { useRouter } from '../../utils/hooks/useRouter'
import {
  ChangeRequestsProgress,
  ConsolidationProgress,
  ReviewAction,
  ReviewProgress,
  ReviewSectionComponentProps,
} from '../../utils/types'
import { useLanguageProvider } from '../../contexts/Localisation'
import useCreateReview from '../../utils/hooks/useCreateReview'
import useRestartReview from '../../utils/hooks/useRestartReview'
import { ReviewStatus } from '../../utils/generated/graphql'
import useUpdateReviewAssignment from '../../utils/hooks/useUpdateReviewAssignment'
import useRemakePreviousReview from '../../utils/hooks/useRemakePreviousReview'

const ReviewSectionRowAction: React.FC<ReviewSectionComponentProps> = (props) => {
  const { strings } = useLanguageProvider()
  const {
    action,
    isAssignedToCurrentUser,
    assignment: { isCurrentUserReviewer },
  } = props

  const getContent = () => {
    switch (action) {
      case ReviewAction.canContinue: {
        if (isAssignedToCurrentUser) {
          return <GenerateActionButton {...props} />
        }
        return (
          <Label className="simple-label">
            <em>{strings.REVIEW_STATUS_IN_PROGRESS}</em>
          </Label>
        )
      }

      case ReviewAction.canView: {
        if (isAssignedToCurrentUser) {
          return <ViewSubmittedReviewButton {...props} />
        }
        return <ViewReviewIcon {...props} />
      }

      case ReviewAction.canStartReview:
      case ReviewAction.canMakeDecision: {
        if (isAssignedToCurrentUser) {
          return <GenerateActionButton {...props} />
        }
        return (
          <Label className="simple-label">
            <em>{strings.REVIEW_STATUS_NOT_STARTED}</em>
          </Label>
        )
      }

      case ReviewAction.canUpdate:
      case ReviewAction.canReStartReview:
      case ReviewAction.canReReview: {
        if (isAssignedToCurrentUser) {
          return <GenerateActionButton {...props} />
        }
        return (
          <Label className="simple-label">
            <em>{strings.REVIEW_STATUS_PENDING_ACTION}</em>
          </Label>
        )
      }

      case ReviewAction.canSelfAssign: {
        if (isCurrentUserReviewer) return <SelfAssignButton {...props} />
        return null
      }

      default:
        return null
    }
  }

  return <Grid.Column textAlign="right">{getContent()}</Grid.Column>
}

const getApplicantChangesUpdatedCount = (reviewProgress?: ReviewProgress) =>
  reviewProgress?.totalNewReviewable || 0

const getReviewerChangesUpdatedCount = (consolidationProgress?: ConsolidationProgress) =>
  consolidationProgress?.totalNewReviewable || 0

const getConsolidatorChangesRequestedCount = (progress?: ChangeRequestsProgress) =>
  progress?.totalChangeRequests || 0

// Possible generate action button: START REVIEW, CONTINUE REVIEW, UPDATE REVIEW, RE-REVIEW or MAKE DECISION
const GenerateActionButton: React.FC<ReviewSectionComponentProps> = ({
  fullStructure,
  section: { details, reviewProgress, consolidationProgress, changeRequestsProgress },
  assignment,
  previousAssignment,
  thisReview,
  action,
}) => {
  const { strings } = useLanguageProvider()
  const {
    location: { pathname },
    push,
  } = useRouter()

  const [error, setError] = useState(false)

  const remakeReview = useRemakePreviousReview({
    structure: fullStructure,
    assignment,
    previousAssignment,
  })

  const restartReview = useRestartReview({
    reviewId: thisReview?.id || 0,
    structure: fullStructure,
    assignment,
  })

  const createReview = useCreateReview({
    structure: fullStructure,
    assignment,
  })

  const getButtonName = () => {
    switch (action) {
      case ReviewAction.canUpdate: {
        const changeRequestsCount = getConsolidatorChangesRequestedCount(changeRequestsProgress)
        return strings.ACTION_UPDATE.concat(
          changeRequestsCount > 0 ? ` (${changeRequestsCount})` : ''
        )
      }
      case ReviewAction.canReReview: {
        const applicantChangesCount = getApplicantChangesUpdatedCount(reviewProgress)
        return strings.BUTTON_REVIEW_RE_REVIEW.concat(
          applicantChangesCount > 0 ? ` (${applicantChangesCount})` : ''
        )
      }
      case ReviewAction.canReStartReview: {
        const reviewerChangesCount = getReviewerChangesUpdatedCount(consolidationProgress)
        return strings.BUTTON_REVIEW_RE_REVIEW.concat(
          reviewerChangesCount > 0 ? ` (${reviewerChangesCount})` : ''
        )
      }
      case ReviewAction.canMakeDecision:
        return strings.ACTION_MAKE_DECISION
      case ReviewAction.canContinue:
        return strings.ACTION_CONTINUE
      default:
        return strings.ACTION_START
    }
  }

  const doAction = async () => {
    const { isFinalDecision } = assignment
    let reviewId = thisReview?.id as number
    if (thisReview?.current.reviewStatus == ReviewStatus.Draft)
      return push(
        `${pathname}/${reviewId}?activeSections=${isFinalDecision ? 'none' : details.code}`
      )

    try {
      if (isFinalDecision)
        reviewId = (await remakeReview()).data?.createReview?.review?.id as number
      else if (thisReview) await restartReview()
      else reviewId = (await createReview()).data?.createReview?.review?.id as number
      push(`${pathname}/${reviewId}?activeSections=${isFinalDecision ? 'none' : details.code}`)
    } catch (e) {
      console.log(e)
      return setError(true)
    }
  }

  if (error) return <Message error title={strings.ERROR_GENERIC} />

  return (
    <a className="user-action clickable" onClick={doAction}>
      {getButtonName()}
    </a>
  )
}

// SELF ASSIGN REVIEW button
const SelfAssignButton: React.FC<ReviewSectionComponentProps> = ({
  assignment,
  fullStructure: structure,
  shouldAssignState: [shouldAssign, setShouldAssign],
}) => {
  const { strings } = useLanguageProvider()
  const [assignmentError, setAssignmentError] = useState(false)

  // Do auto-assign for other sections when one is selected
  // for auto-assignment in another row when shouldAssign == 1
  // Note: This is required to be passed on as props to be processed
  // in each row since the fullStructure is related to each section
  useEffect(() => {
    if (shouldAssign == 1) {
      selfAssignReview()
    }
  }, [shouldAssign])

  const { assignSectionToUser } = useUpdateReviewAssignment(structure)

  const selfAssignReview = async () => {
    {
      try {
        await assignSectionToUser({ assignment, isSelfAssignment: true })
      } catch (e) {
        console.log(e)
        setAssignmentError(true)
      }
    }
  }

  if (assignmentError) return <Message error title={strings.ERROR_GENERIC} />

  return (
    <a
      className="user-action clickable"
      onClick={() => {
        selfAssignReview()
        setShouldAssign(1)
      }}
    >
      {strings.BUTTON_SELF_ASSIGN}
    </a>
  )
}

const ViewSubmittedReviewButton: React.FC<ReviewSectionComponentProps> = ({
  fullStructure,
  section: { details },
}) => {
  const { strings } = useLanguageProvider()
  const { pathname, push } = useRouter()
  const reviewId = fullStructure.thisReview?.id
  return (
    <a
      className="user-action clickable"
      onClick={() => push(`${pathname}/${reviewId}?activeSections=${details.code}`)}
    >
      {strings.ACTION_VIEW}
    </a>
  )
}

// VIEW REVIEW Icon
const ViewReviewIcon: React.FC<ReviewSectionComponentProps> = ({
  fullStructure,
  section: { details },
}) => {
  const { pathname, push } = useRouter()

  const reviewId = fullStructure.thisReview?.id
  return (
    <Icon
      name="chevron right"
      className="dark-grey"
      onClick={() => push(`${pathname}/${reviewId}?activeSections=${details.code}`)}
    />
  )
}

export default ReviewSectionRowAction
