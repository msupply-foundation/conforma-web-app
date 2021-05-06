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
  isConsolidation?: boolean
  latestApplicationResponse: ApplicationResponse
  reviewResponse?: ReviewResponse
  summaryViewProps: SummaryViewWrapperProps
}

const ReviewResponseElement: React.FC<ReviewResponseElementProps> = ({
  isNewApplicationResponse,
  isConsolidation,
  latestApplicationResponse,
  reviewResponse,
  summaryViewProps,
}) => {
  const { query, updateQuery } = useRouter()
  const toggle = query?.openResponse === latestApplicationResponse.templateElement?.code

  const shouldShowReviewButton =
    isConsolidation ||
    (reviewResponse?.status === ReviewResponseStatus.Draft && !reviewResponse?.decision)

  return (
    <>
      <Grid>
        <Grid.Column width={13} textAlign="left">
          <SummaryViewWrapper {...summaryViewProps} />
        </Grid.Column>
        <Grid.Column width={3} textAlign="right" verticalAlign="middle">
          {reviewResponse &&
            reviewResponse.status === ReviewResponseStatus.Draft &&
            !reviewResponse.decision && (
              <ReviewButton
                isNewApplicationResponse={isNewApplicationResponse}
                elementCode={latestApplicationResponse.templateElement?.code as string}
                updateQuery={updateQuery}
              />
            )}
        </Grid.Column>
      </Grid>
      {reviewResponse && (
        <DecisionArea
          reviewResponse={reviewResponse as ReviewResponse}
          toggle={toggle}
          summaryViewProps={summaryViewProps}
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
