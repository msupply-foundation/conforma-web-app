import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ElementStateNEW, PageElement, ResponsesByCode, SectionAndPage } from '../../utils/types'
import ApplicationViewWrapper from '../../formElementPlugins/ApplicationViewWrapperNEW'
import SummaryViewWrapperNEW from '../../formElementPlugins/SummaryViewWrapperNEW'
import { Form, Grid, Segment, Button, Icon, Label } from 'semantic-ui-react'
import getSimplifiedTimeDifference from '../../utils/dateAndTime/getSimplifiedTimeDifference'
import strings from '../../utils/constants'
import {
  ApplicationResponse,
  ReviewResponse,
  ReviewResponseDecision,
  ReviewResponseStatus,
  TemplateElementCategory,
} from '../../utils/generated/graphql'

import {
  ApplicationViewWrapperPropsNEW,
  SummaryViewWrapperPropsNEW,
} from '../../formElementPlugins/types'
import DecisionAreaNEW from '../Review/DecisionAreaNEW'

interface PageElementProps {
  elements: PageElement[]
  responsesByCode: ResponsesByCode
  isStrictPage?: boolean
  canEdit?: boolean
  isReview?: boolean
  isSummary?: boolean
  serial?: string
  sectionAndPage?: SectionAndPage
}

const PageElements: React.FC<PageElementProps> = ({
  elements,
  responsesByCode,
  isStrictPage,
  canEdit,
  isReview,
  isSummary,
  serial,
  sectionAndPage,
}) => {
  const visibleElements = elements.filter(({ element }) => element.isVisible)

  // Editable Application page
  if (canEdit && !isReview && !isSummary)
    return (
      <Form>
        {visibleElements.map(
          ({ element, isChangeRequest, isChanged, previousApplicationResponse }) => {
            const currentReview = previousApplicationResponse?.reviewResponses.nodes[0]
            const changesRequired =
              isChangeRequest || isChanged
                ? {
                    isChangeRequest: isChangeRequest as boolean,
                    isChanged: isChanged as boolean,
                    reviewerComment: currentReview?.comment || '',
                  }
                : undefined

            const props: ApplicationViewWrapperPropsNEW = {
              element,
              isStrictPage,
              changesRequired,
              allResponses: responsesByCode,
              currentResponse: responsesByCode?.[element.code],
            }
            // Wrapper displays response & changes requested warning for LOQ re-submission
            return <ApplicationViewWrapper key={`question_${element.code}`} {...props} />
          }
        )}
      </Form>
    )

  const getSummaryViewProps = (element: ElementStateNEW) => ({
    element,
    response: responsesByCode?.[element.code],
    allResponses: responsesByCode,
  })
  // Summary Page
  if (isSummary) {
    const { sectionCode, pageNumber } = sectionAndPage as SectionAndPage
    return (
      <Form>
        <Segment.Group>
          {visibleElements
            .filter(({ element }) => element.isVisible)
            .map(({ element }) => {
              return (
                <Segment key={`question_${element.code}`}>
                  <Grid columns="equal">
                    <Grid.Column floated="left">
                      <SummaryViewWrapperNEW {...getSummaryViewProps(element)} />
                    </Grid.Column>
                    {element.category === TemplateElementCategory.Question && canEdit && (
                      <Grid.Column floated="right" textAlign="right">
                        <Button
                          content={strings.BUTTON_SUMMARY_EDIT}
                          size="small"
                          as={Link}
                          to={`/application/${serial}/${sectionCode}/Page${pageNumber}`}
                        />
                      </Grid.Column>
                    )}
                  </Grid>
                </Segment>
              )
            })}
        </Segment.Group>
      </Form>
    )
  }

  // TODO: Find out problem to display edit button with review responses when Review is locked

  if (isReview) {
    return (
      <Form>
        {visibleElements.map(
          ({
            element,
            thisReviewLatestResponse,
            isNewApplicationResponse,
            latestApplicationResponse,
          }) => {
            const props: ElementComponentProps = {
              isNewApplicationResponse: !!isNewApplicationResponse,
              latestApplicationResponse: latestApplicationResponse,
              summaryProps: getSummaryViewProps(element),
              thisReviewLatestResponse: thisReviewLatestResponse,
            }
            return (
              <>
                <Segment
                  key={`question_${element.id}`}
                  style={{
                    borderRadius: 8,
                    borderBottomLeftRadius: thisReviewLatestResponse?.decision ? 0 : 8,
                    borderBottomRightRadius: thisReviewLatestResponse?.decision ? 0 : 8,
                    border: 'none',
                    boxShadow: 'none',
                    margin: 10,
                    marginBottom: thisReviewLatestResponse?.decision ? 0 : 10,
                  }}
                >
                  <Grid columns="equal">
                    {element.category === TemplateElementCategory.Question ? (
                      <QuestionResponseComponent {...props} />
                    ) : (
                      <InformationComponent {...props} />
                    )}
                  </Grid>
                </Segment>
                {thisReviewLatestResponse && (
                  <ReviewResponseComponent
                    latestApplicationResponse={latestApplicationResponse}
                    reviewResponse={thisReviewLatestResponse}
                    summaryViewProps={props.summaryProps}
                  />
                )}
              </>
            )
          }
        )}
      </Form>
    )
  }
  return null
}

interface ElementComponentProps {
  isNewApplicationResponse: boolean
  latestApplicationResponse: ApplicationResponse
  summaryProps: SummaryViewWrapperPropsNEW
  thisReviewLatestResponse?: ReviewResponse
}

const InformationComponent: React.FC<ElementComponentProps> = ({ summaryProps }) => (
  <Grid.Column stretched>
    <SummaryViewWrapperNEW {...summaryProps} />
  </Grid.Column>
)

const QuestionResponseComponent: React.FC<ElementComponentProps> = ({
  isNewApplicationResponse,
  summaryProps,
  thisReviewLatestResponse,
}) => (
  <>
    <Grid.Column floated="left">
      <SummaryViewWrapperNEW {...summaryProps} />
    </Grid.Column>
    <Grid.Column floated="right" textAlign="right">
      <ReviewButton
        isNewApplicationResponse={isNewApplicationResponse}
        reviewResponse={thisReviewLatestResponse as ReviewResponse}
        summaryViewProps={summaryProps}
      />
    </Grid.Column>
  </>
)

const ReviewResponseComponent: React.FC<{
  reviewResponse: ReviewResponse
  summaryViewProps: SummaryViewWrapperPropsNEW
  latestApplicationResponse: ApplicationResponse
}> = ({ reviewResponse, summaryViewProps, latestApplicationResponse }) => {
  const [toggleDecisionArea, setToggleDecisionArea] = useState(false)

  if (!reviewResponse) return null
  if (!reviewResponse?.decision) return null
  if (!reviewResponse?.decision) return null

  // After review is submitted, reviewResponses are trimmed if they are not changed duplicates
  // or if they are null, we only want to show reviewResponses that are linked to latestApplicationResponse
  if (latestApplicationResponse.id !== reviewResponse.applicationResponse?.id) return null

  return (
    <div
      style={{
        display: 'flex',
        background: 'rgb(249, 255, 255)',
        margin: 10,
        marginTop: 0,
        borderTop: '3px solid rgb(230, 230, 230)',
        borderBottom: '3px solid rgb(230, 230, 230)',
        padding: 14,
      }}
    >
      <div style={{ color: 'rgb(150, 150, 150)', marginRight: 20 }}>
        {reviewResponse.review?.reviewer?.firstName} {reviewResponse.review?.reviewer?.lastName}
      </div>
      <div style={{ flexGrow: 1, textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Icon
            name="circle"
            size="tiny"
            color={reviewResponse?.decision === ReviewResponseDecision.Approve ? 'green' : 'red'}
          />
          <text
            style={{
              fontWeight: 'bolder',
              fontSize: 16,
              marginRight: 10,
            }}
          >
            {reviewResponse?.decision === ReviewResponseDecision.Approve
              ? 'Conform'
              : 'Non Conform'}
          </text>
          <Label style={{ padding: 6 }} size="mini">
            {getSimplifiedTimeDifference(reviewResponse.timeUpdated)}
          </Label>
        </div>
        {!reviewResponse.comment ? null : (
          <div
            style={{
              color: 'grey',

              display: 'flex',
              margin: 6,
            }}
          >
            <Icon name="comment alternate outline" color="grey" />
            <div
              style={{
                marginLeft: 6,
              }}
            >
              {reviewResponse.comment}
            </div>
          </div>
        )}
      </div>
      {reviewResponse.status === ReviewResponseStatus.Draft && (
        <Icon name="edit" color="blue" onClick={() => setToggleDecisionArea(!toggleDecisionArea)} />
      )}
      <DecisionAreaNEW
        reviewResponse={reviewResponse}
        toggle={toggleDecisionArea}
        summaryViewProps={summaryViewProps}
      />
    </div>
  )
}

const ReviewButton: React.FC<{
  reviewResponse: ReviewResponse
  summaryViewProps: SummaryViewWrapperPropsNEW
  isNewApplicationResponse?: boolean
}> = ({ reviewResponse, summaryViewProps, isNewApplicationResponse }) => {
  const [toggleDecisionArea, setToggleDecisionArea] = useState(false)

  if (!reviewResponse) return null
  if (reviewResponse?.decision) return null
  if (reviewResponse.status !== ReviewResponseStatus.Draft) return null

  return (
    <>
      <Button
        content={
          isNewApplicationResponse
            ? strings.BUTTON_RE_REVIEW_RESPONSE
            : strings.BUTTON_REVIEW_RESPONSE
        }
        size="small"
        style={{
          letterSpacing: 0.8,
          fontWeight: 1000,
          fontSize: 17,
          background: 'none',
          color: '#003BFE',
          border: 'none',
          borderRadius: 8,
          textTransform: 'capitalize',
        }}
        onClick={() => setToggleDecisionArea(!toggleDecisionArea)}
      />
      <DecisionAreaNEW
        reviewResponse={reviewResponse}
        toggle={toggleDecisionArea}
        summaryViewProps={summaryViewProps}
      />
    </>
  )
}

export default PageElements
