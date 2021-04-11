import React from 'react'
import { Icon, Label, Progress } from 'semantic-ui-react'
import { ReviewProgress, SectionProgress, SectionState } from '../../utils/types'
import strings from '../../utils/constants'

const SectionProgress: React.FC<SectionState> = ({ reviewProgress, reviewAction }) => {
  if (reviewAction?.isAssignedToCurrentUser && reviewProgress) {
    return reviewAction.isReviewable ? (
      <SectionProgressBar reviewProgress={reviewProgress} />
    ) : (
      <Label
        icon={<Icon name="circle" size="mini" color="blue" />}
        content={strings.LABEL_ASSIGNED_TO_YOU}
      />
    )
  }
  return <Label style={labelStyle}>{strings.LABEL_ASSIGNED_TO_OTHER}</Label>
}

const getProgressTitle = ({ doneNonConform, doneConform, totalReviewable }: ReviewProgress) => {
  if (doneNonConform > 0) return `(${doneNonConform}) ${strings.LABEL_REVIEW_DECLINED}`
  else if (doneConform === totalReviewable) return strings.LABEL_REVIEW_COMPLETED
  return null
}

type SectionProgressBarProps = { reviewProgress: ReviewProgress }

const SectionProgressBar: React.FC<SectionProgressBarProps> = ({ reviewProgress }) => {
  const { doneNonConform, doneConform, totalReviewable } = reviewProgress
  return (
    <Progress
      style={{ width: 150, display: 'inline-flex' }}
      percent={(100 * (doneConform + doneNonConform)) / totalReviewable}
      size="tiny"
      success={doneNonConform === 0}
      error={doneNonConform > 0}
      label={getProgressTitle(reviewProgress)}
    />
  )
}

// Styles - TODO: Move to LESS || Global class style (semantic)
const labelStyle = { background: 'none', color: 'Black' }

export default SectionProgress
export { SectionProgressBar }
