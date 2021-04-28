import React from 'react'
import { Icon, Label, Progress } from 'semantic-ui-react'
import { ApplicationProgress, ReviewProgress, SectionState } from '../../utils/types'
import strings from '../../utils/constants'

const ReviewStatusOrProgress: React.FC<SectionState> = ({ reviewProgress, reviewAction }) => {
  if (reviewAction?.isAssignedToCurrentUser && reviewProgress) {
    return reviewAction.isReviewable ? (
      <ReviewSectionProgressBar {...reviewProgress} />
    ) : (
      <Label
        icon={<Icon name="circle" size="mini" color="blue" />}
        content={strings.LABEL_ASSIGNED_TO_YOU}
      />
    )
  }
  return <Label style={labelStyle}>{strings.LABEL_ASSIGNED_TO_OTHER}</Label>
}

const getReviewProgressTitle = ({
  doneNonConform,
  doneConform,
  totalReviewable,
}: ReviewProgress) => {
  if (doneNonConform > 0) return `(${doneNonConform}) ${strings.LABEL_REVIEW_DECLINED}`
  else if (doneConform === totalReviewable) return strings.LABEL_SECTION_COMPLETED
  return null
}

const ReviewSectionProgressBar: React.FC<ReviewProgress> = (reviewProgress) => {
  const { doneNonConform, doneConform, totalReviewable } = reviewProgress
  const progressLabel = getReviewProgressTitle(reviewProgress)
  return (
    <div className="progress-box">
      {progressLabel && <Label className="simple-label" content={progressLabel} />}
      <Progress
        className="progress"
        percent={(100 * (doneConform + doneNonConform)) / totalReviewable}
        size="tiny"
        success={doneNonConform === 0}
        error={doneNonConform > 0}
      />
    </div>
  )
}

const getApplicationProgressTitle = ({ completed, valid }: ApplicationProgress) => {
  if (!valid) return strings.LABEL_SECTION_PROBLEM
  else if (completed) return strings.LABEL_SECTION_COMPLETED
  return null
}

const ApplicationProgressBar: React.FC<ApplicationProgress> = (applicationProgress) => {
  const { doneRequired, doneNonRequired, totalSum, valid } = applicationProgress
  const totalDone = doneRequired + doneNonRequired
  const progressLabel = getApplicationProgressTitle(applicationProgress)
  return totalDone > 0 && totalSum > 0 ? (
    <div className="progress-box">
      {progressLabel && <Label className="simple-label" content={progressLabel} />}
      <Progress
        className="progress"
        percent={(100 * totalDone) / totalSum}
        size="tiny"
        success={valid}
        error={!valid}
      />
    </div>
  ) : null
}

// Styles - TODO: Move to LESS || Global class style (semantic)
const labelStyle = { background: 'none', color: 'Black' }

export default ReviewStatusOrProgress
export { ReviewSectionProgressBar, ApplicationProgressBar }
