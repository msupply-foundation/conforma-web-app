import React from 'react'
import { Icon, Label, Progress, Segment } from 'semantic-ui-react'
import { ReviewProgress, SectionProgress, SectionStateNEW } from '../../utils/types'
import strings from '../../utils/constants'

const SectionProgress: React.FC<SectionStateNEW> = ({ assigned, reviewProgress }) => {
  const getProgressTitle = ({ doneNonConform, doneConform, totalReviewable }: ReviewProgress) => {
    if (doneNonConform > 0)
      return strings.LABEL_REVIEW_DECLINED.replace('%1', doneNonConform.toString())
    else if (doneConform === totalReviewable) return strings.LABEL_REVIEW_COMPLETE
    return null
  }

  return assigned?.current ? (
    reviewProgress && reviewProgress.totalReviewable > 0 ? (
      <Progress
        percent={
          (100 * (reviewProgress.doneConform + reviewProgress.doneNonConform)) /
          reviewProgress.totalReviewable
        }
        size="tiny"
        success={reviewProgress.doneNonConform === 0}
        error={reviewProgress.doneNonConform > 0}
        label={getProgressTitle(reviewProgress)}
      />
    ) : (
      <Segment vertical>
        <Icon name="circle" size="mini" color="blue" />
        <Label basic>{strings.LABEL_ASSIGNED_TO_YOU}</Label>
      </Segment>
    )
  ) : (
    <Label style={{ backgroundColor: 'WhiteSmoke', color: 'Blue' }}>
      {strings.LABEL_ASSIGNED_TO_OTHER}
    </Label>
  )
}

export default SectionProgress
