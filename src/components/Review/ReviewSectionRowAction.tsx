import React, { CSSProperties, useState } from 'react'
import { Button, Grid, Icon, Message } from 'semantic-ui-react'
import { useRouter } from '../../utils/hooks/useRouter'
import { ReviewAction, ReviewProgress, ReviewSectionComponentProps } from '../../utils/types'
import strings from '../../utils/constants'
import useCreateReview from '../../utils/hooks/useCreateReview'
import useRestartReview from '../../utils/hooks/useRestartReview'
import { ReviewStatus } from '../../utils/generated/graphql'
import useUpdateReviewAssignment from '../../utils/hooks/useUpdateReviewAssignment'

const ReviewSectionRowAction: React.FC<ReviewSectionComponentProps> = (props) => {
  const {
    action,
    section: { reviewProgress },
    isAssignedToCurrentUser,
    thisReview,
    assignment: { isCurrentUserReviewer },
  } = props

  const getContent = () => {
    switch (action) {
      case ReviewAction.canContinue: {
        if (isAssignedToCurrentUser) {
          return <StartContinueOrRestartButton {...props} />
        }
        return <div style={inProgressStyle}>{strings.STATUS_IN_PROGRESS}</div>
      }

      case ReviewAction.canView: {
        return <ViewReviewIcon {...props} />
      }

      case ReviewAction.canStartReview: {
        if (isAssignedToCurrentUser) {
          return <StartContinueOrRestartButton {...props} />
        }
        return <NotStartedLabel />
      }

      case ReviewAction.canReReview: {
        if (isAssignedToCurrentUser) return <StartContinueOrRestartButton {...props} />

        return null
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

const reReviewableCount = (reviewProgress?: ReviewProgress) =>
  (reviewProgress?.totalNewReviewable || 0) - (reviewProgress?.doneNewReviewable || 0)

// START CONTINUE OR RESTART BUTTON
const StartContinueOrRestartButton: React.FC<ReviewSectionComponentProps> = ({
  fullStructure,
  section: { details, reviewProgress },
  assignment,
  thisReview,
  action,
}) => {
  const {
    location: { pathname },
    push,
  } = useRouter()

  const [error, setError] = useState(false)

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
    const reReviewCount = reReviewableCount(reviewProgress)
    if (reReviewCount > 0) return `${strings.BUTTON_REVIEW_RE_REVIEW} (${reReviewCount})`
    return action === ReviewAction.canContinue ? strings.ACTION_CONTINUE : strings.ACTION_START
  }

  const doAction = async () => {
    let reviewId = thisReview?.id as number
    if (thisReview?.status == ReviewStatus.Draft)
      return push(`${pathname}/${reviewId}?activeSections=${details.code}`)

    try {
      if (thisReview) await restartReview()
      else reviewId = (await createReview()).data?.createReview?.review?.id as number
      push(`${pathname}/${reviewId}?activeSections=${details.code}`)
    } catch (e) {
      console.log(e)
      return setError(true)
    }
  }

  if (error) return <Message error title={strings.ERROR_GENERIC} />

  return (
    <Button style={actionReReviewStyle} onClick={doAction}>
      {getButtonName()}
    </Button>
  )
}

// SELF ASSIGN REVIEW button
const SelfAssignButton: React.FC<ReviewSectionComponentProps> = ({
  assignment,
  fullStructure: structure,
}) => {
  const [assignmentError, setAssignmentError] = useState(false)

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

  return <Button onClick={selfAssignReview}>{strings.BUTTON_SELF_ASSIGN}</Button>
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
      style={viewIconStyle}
      onClick={() => push(`${pathname}/${reviewId}?activeSections=${details.code}`)}
      name="angle right"
    />
  )
}

// NOT_STARTED LABEL
const NotStartedLabel: React.FC = () => (
  <div style={notStartedLabelStyle}>{strings.STATUS_NOT_STARTED}</div>
)

// Styles - TODO: Move to LESS || Global class style (semantic)
const actionContinueStyle = {
  color: '#003BFE',
  fontWeight: 800,
  letterSpacing: 1,
  background: 'none',
  border: 'none',
  fontSize: 16,
} as CSSProperties

const actionStartStyle = {
  color: '#003BFE',
  fontWeight: 400,
  letterSpacing: 1,
  background: 'none',
  border: 'none',
  fontSize: 16,
} as CSSProperties

const actionReReviewStyle = {
  color: '#003BFE',
  fontWeight: 400,
  letterSpacing: 1,
  background: 'none',
  border: 'none',
  fontSize: 16,
} as CSSProperties

const inProgressStyle = {
  color: 'rgb(130, 130, 130)',
  fontStyle: 'italic',
  marginRight: 20,
} as CSSProperties

const viewIconStyle = { color: 'rgb(130, 130, 130)' }

const notStartedLabelStyle = {
  color: 'rgb(130, 130, 130)',
  fontStyle: 'italic',
  marginRight: 20,
} as CSSProperties

export default ReviewSectionRowAction
