import React from 'react'
import { Icon, Label, Progress, Segment } from 'semantic-ui-react'
import { Page, SectionProgress, SectionState } from '../../utils/types'
import strings from '../../utils/constants'
import { ReviewResponseDecision } from '../../utils/generated/graphql'

const ReviewProgress: React.FC<SectionState> = ({ assigned, progress, pages }) => {
  const getProgressTitle = (progress: SectionProgress, pages: { [pageName: string]: Page }) => {
    if (progress.valid) {
      return progress.completed ? strings.LABEL_REVIEW_COMPLETE : ''
    }
    let declinedResponses = 0
    Object.values(pages).forEach(({ state }) => {
      declinedResponses += state.filter(
        ({ review }) => review?.decision === ReviewResponseDecision.Decline
      ).length
    })
    return declinedResponses > 0
      ? strings.LABEL_REVIEW_DECLINED.replace('%1', declinedResponses.toString())
      : ''
  }

  return assigned ? (
    progress && progress.done > 0 && progress.total > 0 ? (
      <Progress
        percent={(100 * progress.done) / progress.total}
        size="tiny"
        success={progress.valid}
        error={!progress.valid}
        label={getProgressTitle(progress, pages)}
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

export default ReviewProgress
