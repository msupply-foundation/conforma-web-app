import React, { CSSProperties, useState } from 'react'
import { Button, Grid } from 'semantic-ui-react'
import { SummaryViewWrapper } from '../../../formElementPlugins'
import { SummaryViewWrapperProps } from '../../../formElementPlugins/types'
import {
  ApplicationResponse,
  ReviewResponse,
  ReviewResponseStatus,
} from '../../../utils/generated/graphql'
import DecisionArea from '../../Review/DecisionArea'
import strings from '../../../utils/constants'
import { Link } from 'react-router-dom'

interface ReviewResponseElementProps {
  isNewApplicationResponse: boolean
  latestApplicationResponse: ApplicationResponse
  thisReviewLatestResponse?: ReviewResponse
  summaryProps: SummaryViewWrapperProps
}

const ReviewResponseElement: React.FC<ReviewResponseElementProps> = ({
  isNewApplicationResponse,
  thisReviewLatestResponse,
  summaryProps,
}) => {
  const decisionArea = useState(false)
  const [toggle] = decisionArea

  return (
    <>
      <Grid>
        <Grid.Column width={13} textAlign="left">
          <SummaryViewWrapper {...summaryProps} />
        </Grid.Column>
        <Grid.Column width={3} textAlign="right" verticalAlign="middle">
          {thisReviewLatestResponse &&
            thisReviewLatestResponse.status === ReviewResponseStatus.Draft &&
            !thisReviewLatestResponse.decision && (
              <ReviewButton
                isNewApplicationResponse={isNewApplicationResponse}
                decisionArea={decisionArea}
              />
            )}
        </Grid.Column>
      </Grid>
      {thisReviewLatestResponse && (
        <DecisionArea
          reviewResponse={thisReviewLatestResponse as ReviewResponse}
          toggle={toggle}
          summaryViewProps={summaryProps}
        />
      )}
    </>
  )
}

const ReviewButton: React.FC<{
  isNewApplicationResponse?: boolean
  decisionArea: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}> = ({ isNewApplicationResponse, decisionArea: [toggleDecisionArea, setToggleDecisionArea] }) => (
  <p className="link-style" onClick={() => setToggleDecisionArea(!toggleDecisionArea)}>
    <strong>
      {isNewApplicationResponse
        ? strings.BUTTON_RE_REVIEW_RESPONSE
        : strings.BUTTON_REVIEW_RESPONSE}
    </strong>
  </p>
)

export default ReviewResponseElement
