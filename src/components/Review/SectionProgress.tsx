import React from 'react'
import { Icon, Label, Progress } from 'semantic-ui-react'
import { ReviewProgress, SectionProgress, SectionStateNEW } from '../../utils/types'
import strings from '../../utils/constants'

const SectionProgress: React.FC<SectionStateNEW> = ({ assigned, reviewProgress }) => {
  const getProgressTitle = ({ doneNonConform, doneConform, totalReviewable }: ReviewProgress) => {
    if (doneNonConform > 0) return `(${doneNonConform}) ${strings.LABEL_REVIEW_DECLINED}`
    else if (doneConform === totalReviewable) return strings.LABEL_REVIEW_COMPLETED
    return null
  }

  if (assigned?.current && reviewProgress) {
    const { doneNonConform, doneConform, totalReviewable } = reviewProgress
    return doneConform + doneNonConform > 0 && totalReviewable > 0 ? (
      <Progress
        style={{ width: 150, display: 'inline-flex' }}
        percent={(100 * (doneConform + doneNonConform)) / totalReviewable}
        size="tiny"
        success={doneNonConform === 0}
        error={doneNonConform > 0}
        label={getProgressTitle(reviewProgress)}
      />
    ) : (
      <Label
        basic
        icon={<Icon name="circle" size="mini" color="blue" />}
        content={strings.LABEL_ASSIGNED_TO_YOU}
      />
    )
  }
  return (
    <Label style={{ backgroundColor: 'White', color: 'Black' }}>
      {strings.LABEL_ASSIGNED_TO_OTHER}
    </Label>
  )
}

export default SectionProgress
