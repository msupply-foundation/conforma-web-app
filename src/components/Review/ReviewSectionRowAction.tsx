import React, { useState } from 'react'
import { Grid, Icon, Label, Message } from 'semantic-ui-react'
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
    assignment: { isCurrentUserReviewer },
  } = props

  const getContent = () => {
    switch (action) {
      case ReviewAction.canContinue: {
        if (isAssignedToCurrentUser) {
          if (reReviewableCount(reviewProgress) > 0) return <ReReviewButton {...props} />
          else return <ContinueReviewButton {...props} />
        } else
          return (
            <Label className="simple-label">
              <em>{strings.STATUS_IN_PROGRESS}</em>
            </Label>
          )
      }
      case ReviewAction.canView: {
        return <ViewReviewIcon {...props} />
      }

      case ReviewAction.canStartReview: {
        if (isAssignedToCurrentUser) return <StartReviewButton {...props} />
        else return <NotStartedLabel />
      }

      case ReviewAction.canReReview: {
        if (isAssignedToCurrentUser) return <ReReviewButton {...props} />

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

// RE-REVIEW button
const ReReviewButton: React.FC<ReviewSectionComponentProps> = ({
  fullStructure,
  section: { details, reviewProgress },
  assignment,
}) => {
  const {
    location: { pathname },
    push,
  } = useRouter()

  const [restartReviewError, setRestartReviewError] = useState(false)
  const reviewId = fullStructure.thisReview?.id

  const restartReview = useRestartReview({
    reviewId: reviewId || 0,
    structure: fullStructure,
    assignment,
  })

  const restart = async () => {
    {
      try {
        await restartReview()
        push(`${pathname}/${reviewId}?activeSections=${details.code}`)
      } catch (e) {
        console.error(e)
        return setRestartReviewError(true)
      }
    }
  }

  if (restartReviewError) return <Message error title={strings.ERROR_GENERIC} />

  if (reReviewableCount(reviewProgress) === 0) return null

  const reReviewCount = reReviewableCount(reviewProgress)

  if (reReviewCount === 0) return null

  // Either need to run a mutation to re-review or just navigate to section
  const buttonAction =
    fullStructure.thisReview?.status == ReviewStatus.Draft
      ? () => push(`${pathname}/${reviewId}?activeSections=${details.code}`)
      : restart

  return (
    <a
      className="user-action clickable"
      onClick={buttonAction}
    >{`${strings.BUTTON_REVIEW_RE_REVIEW} (${reReviewCount})`}</a>
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

  return (
    <a className="user-action clickable" onClick={selfAssignReview}>
      {strings.BUTTON_SELF_ASSIGN}
    </a>
  )
}

// START REVIEW button
const StartReviewButton: React.FC<ReviewSectionComponentProps> = ({
  assignment,
  fullStructure,
  section: { details },
}) => {
  const {
    location: { pathname },
    push,
  } = useRouter()

  const [startReviewError, setStartReviewError] = useState(false)

  const { createReviewFromStructure } = useCreateReview({
    structure: fullStructure,
    assignment,
  })

  const startReview = async () => {
    {
      try {
        const result = await createReviewFromStructure(fullStructure)
        const newReviewId = result.data?.createReview?.review?.id
        push(`${pathname}/${newReviewId}?activeSections=${details.code}`)
      } catch (e) {
        console.error(e)
        return setStartReviewError(true)
      }
    }
  }

  if (startReviewError) return <Message error title={strings.ERROR_GENERIC} />

  return (
    <a className="user-action clickable" onClick={startReview}>
      {strings.ACTION_START}
    </a>
  )
}

// CONTINUE REVIEW Button
const ContinueReviewButton: React.FC<ReviewSectionComponentProps> = ({
  fullStructure,
  section: { details },
}) => {
  const {
    location: { pathname },
  } = useRouter()

  const reviewId = fullStructure.thisReview?.id

  return (
    <a
      className="user-action clickable"
      href={`${pathname}/${reviewId}?activeSections=${details.code}`}
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

// NOT_STARTED LABEL
const NotStartedLabel: React.FC = () => (
  <Label className="simple-label" content={strings.STATUS_NOT_STARTED} />
)

export default ReviewSectionRowAction
