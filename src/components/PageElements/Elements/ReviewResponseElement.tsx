import React from 'react'
import { Grid } from 'semantic-ui-react'
import { useRouter } from '../../../utils/hooks/useRouter'
import { SummaryViewWrapper } from '../../../formElementPlugins'
import { SummaryViewWrapperProps } from '../../../formElementPlugins/types'
import {
  ApplicationResponse,
  ReviewResponse,
  ReviewResponseStatus,
} from '../../../utils/generated/graphql'
import DecisionArea from '../../Review/DecisionArea'
import strings from '../../../utils/constants'

interface ReviewResponseElementProps {
  isNewApplicationResponse: boolean
  latestApplicationResponse: ApplicationResponse
  thisReviewLatestResponse?: ReviewResponse
  summaryProps: SummaryViewWrapperProps
}

const ReviewResponseElement: React.FC<ReviewResponseElementProps> = ({
  isNewApplicationResponse,
  latestApplicationResponse,
  thisReviewLatestResponse,
  summaryProps,
}) => {
  const { query, updateQuery } = useRouter()
  const toggle = query?.openResponse === latestApplicationResponse.templateElement?.code

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
                elementCode={latestApplicationResponse.templateElement?.code as string}
                updateQuery={updateQuery}
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
  elementCode: string
  updateQuery: Function
}> = ({ isNewApplicationResponse, elementCode, updateQuery }) => (
  <p className="link-style clickable" onClick={() => updateQuery({ openResponse: elementCode })}>
    <strong>
      {isNewApplicationResponse
        ? strings.BUTTON_RE_REVIEW_RESPONSE
        : strings.BUTTON_REVIEW_RESPONSE}
    </strong>
  </p>
)

export default ReviewResponseElement
