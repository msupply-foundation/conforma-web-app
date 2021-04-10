import React, { CSSProperties } from 'react'
import { Grid, Icon, Label } from 'semantic-ui-react'
import { SummaryViewWrapper } from '../../../../formElementPlugins'
import { SummaryViewWrapperProps } from '../../../../formElementPlugins/types'
import getSimplifiedTimeDifference from '../../../../utils/dateAndTime/getSimplifiedTimeDifference'
import { ApplicationResponse, ReviewResponseDecision } from '../../../../utils/generated/graphql'

interface SummaryReviewResponseElementProps {
  previousApplicationResponse: ApplicationResponse
  summaryProps: SummaryViewWrapperProps
}

const SummaryReviewResponseElement: React.FC<SummaryReviewResponseElementProps> = ({
  previousApplicationResponse,
  summaryProps,
}) => {
  const reviewResponse = previousApplicationResponse.reviewResponses.nodes?.[0]

  if (!reviewResponse) return null
  if (!reviewResponse?.decision) return null

  // If review was approved we don't need to show to the Applicant
  if (reviewResponse?.decision === ReviewResponseDecision.Approve) return null

  const { element, allResponses } = summaryProps
  const previousReviewProps = {
    element,
    allResponses,
    response: {
      id: previousApplicationResponse.id,
      text: previousApplicationResponse.value.text,
    },
    displayTitle: false,
  }

  return (
    <Grid>
      <Grid.Column floated="left" width={4}>
        <Label
          style={datePaddingStyle}
          size="mini"
          content={getSimplifiedTimeDifference(reviewResponse.timeUpdated)}
        />
      </Grid.Column>
      <Grid.Column floated="left" width={12}>
        <SummaryViewWrapper {...previousReviewProps} />
        <div style={changesRequestedStyles.body}>
          <Icon name="comment alternate outline" color="grey" />
          <div style={commentMargin}>{reviewResponse.comment || ''}</div>
        </div>
      </Grid.Column>
    </Grid>
  )
}

// Styles - TODO: Move to LESS || Global class style (semantic)
const changesRequestedStyles = {
  body: {
    color: 'grey',
    display: 'flex',
    margin: 6,
  } as CSSProperties,
}

const commentMargin = { marginLeft: 6 } as CSSProperties
const datePaddingStyle = { padding: 6 } as CSSProperties

export default SummaryReviewResponseElement
