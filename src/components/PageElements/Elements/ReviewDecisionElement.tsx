import React from 'react'
import { Icon, Label, Grid } from 'semantic-ui-react'
import getSimplifiedTimeDifference from '../../../utils/dateAndTime/getSimplifiedTimeDifference'
import { ReviewResponseDecision } from '../../../utils/generated/graphql'
import strings from '../../../utils/constants'
import { ReviewElementProps } from '../../../utils/types'

const ReviewDecisionElement: React.FC<ReviewElementProps> = ({
  reviewResponse,
  applicationResponse,
  children,
}) => {
  if (!reviewResponse) return null
  if (!reviewResponse?.decision) return null

  // After review is submitted, reviewResponses are trimmed if they are not changed duplicates
  // or if they are null, we only want to show reviewResponses that are linked to latestApplicationResponse
  if (applicationResponse.id !== reviewResponse.applicationResponse?.id) return null

  return (
    <div className="review-comment-area">
      <Grid columns="equal" className="review-comment-grid">
        <Grid.Column width={2} textAlign="left">
          {reviewResponse.review?.reviewer?.firstName} {reviewResponse.review?.reviewer?.lastName}
        </Grid.Column>
        <Grid.Column width={12} textAlign="left">
          <div>
            <Icon
              name="circle"
              size="tiny"
              color={reviewResponse?.decision === ReviewResponseDecision.Approve ? 'green' : 'pink'}
            />
            <Label className="simple-label">
              <strong>
                {reviewResponse?.decision === ReviewResponseDecision.Approve
                  ? strings.LABEL_REVIEW_DECICION_CONFORM
                  : strings.LABEL_REVIEW_DECISION_NON_CONFORM}
              </strong>
            </Label>
            <Label size="mini" className="simple-label shift-up-1">
              <strong>{getSimplifiedTimeDifference(reviewResponse.timeUpdated)}</strong>
            </Label>
          </div>
          {!reviewResponse.comment ? null : (
            <div>
              <Icon name="comment alternate outline" color="grey" />
              {reviewResponse.comment}
            </div>
          )}
        </Grid.Column>
        <Grid.Column textAlign="right" width={2}>
          {children}
        </Grid.Column>
      </Grid>
    </div>
  )
}

export default ReviewDecisionElement
