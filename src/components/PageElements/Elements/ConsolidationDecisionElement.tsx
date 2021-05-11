import React from 'react'
import { Icon, Label, Grid } from 'semantic-ui-react'
import getSimplifiedTimeDifference from '../../../utils/dateAndTime/getSimplifiedTimeDifference'
import { ReviewResponse, ReviewResponseDecision } from '../../../utils/generated/graphql'
import strings from '../../../utils/constants'

interface ReviewDecisionElementProps {
  reviewResponse?: ReviewResponse
  originalReviewResponse?: ReviewResponse
}

const ConsolidationDecisionElement: React.FC<ReviewDecisionElementProps> = ({
  reviewResponse,
  originalReviewResponse,
  children,
}) => {
  //   const [toggleDecisionArea, setToggleDecisionArea] = useState(false)

  if (!reviewResponse) return null
  if (!reviewResponse?.decision) return null

  // After consolidation is submitted, reviewResponses are trimmed if they are not changed duplicates
  // or if they are null, we only want to show reviewResponses that are linked to latestOriginalReviewResponse - from reviewer
  if (originalReviewResponse?.id !== reviewResponse.reviewResponseLinkId) return null

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
              color={reviewResponse?.decision === ReviewResponseDecision.Agree ? 'green' : 'pink'}
            />
            <Label className="simple-label">
              <strong>
                {getConsolidationDecisionLabel(
                  reviewResponse,
                  originalReviewResponse as ReviewResponse
                )}
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

const getConsolidationDecisionLabel = (
  reviewResponse: ReviewResponse,
  originalReviewResponse: ReviewResponse
) => {
  const { decision } = reviewResponse
  const { decision: originalDecision } = originalReviewResponse
  switch (decision) {
    case ReviewResponseDecision.Agree:
      return originalDecision === ReviewResponseDecision.Approve
        ? strings.LABEL_CONSOLIDATION_AGREED_CONFORM
        : strings.LABEL_CONSOLIDATION_AGREED_NON_CONFORM
    case ReviewResponseDecision.Disagree:
      return originalDecision === ReviewResponseDecision.Approve
        ? strings.LABEL_CONSOLIDATION_DISAGREED_CONFORM
        : strings.LABEL_CONSOLIDATION_DISAGREED_NON_CONFORM
    default:
      return null
  }
}
export default ConsolidationDecisionElement
