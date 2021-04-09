import React, { useState, CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ElementStateNEW, PageElement, ResponsesByCode, SectionAndPage } from '../../utils/types'
import ApplicationViewWrapper from '../../formElementPlugins/ApplicationViewWrapperNEW'
import SummaryViewWrapperNEW from '../../formElementPlugins/SummaryViewWrapperNEW'
import { Form, Grid, Segment, Button, Icon, Label, Header } from 'semantic-ui-react'
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
import { useRouter } from '../../utils/hooks/useRouter'

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
        {visibleElements.map((state) => {
          const {
            element,
            isChanged,
            isChangeRequest,
            previousApplicationResponse,
            latestApplicationResponse,
          } = state
          // console.log(state.element.code, state.element.category, state)
          const props: SummaryComponentProps = {
            canEdit: !!canEdit,
            linkToPage: `application/${serial}/${sectionCode}/Page${pageNumber}`,
            summaryProps: getSummaryViewProps(element),
            latestApplicationResponse: latestApplicationResponse,
            previousApplicationResponse: previousApplicationResponse,
          }

          const changedQuestionResponse = !isChangeRequest && !isChanged

          return (
            <div key={`question_${element.id}`}>
              <Segment style={inlineStyles({ isChangeRequest })}>
                {element.category === TemplateElementCategory.Question ? (
                  changedQuestionResponse ? (
                    <SummaryResponseComponent {...props} />
                  ) : (
                    <ChangedQuestionResponseComponent {...props} />
                  )
                ) : (
                  <InformationComponent {...props} />
                )}
              </Segment>
              {isChangeRequest && <ChangedReviewResponseComponent {...props} />}
            </div>
          )
        })}
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
            const props: ReviewComponentProps = {
              isNewApplicationResponse: !!isNewApplicationResponse,
              latestApplicationResponse: latestApplicationResponse,
              summaryProps: getSummaryViewProps(element),
              thisReviewLatestResponse: thisReviewLatestResponse,
            }

            const isChangeRequest: boolean = !!thisReviewLatestResponse?.decision

            return (
              <>
                <Segment key={`question_${element.id}`} style={inlineStyles({ isChangeRequest })}>
                  {element.category === TemplateElementCategory.Question ? (
                    <ReviewQuestionResponseComponent {...props} />
                  ) : (
                    <InformationComponent {...props} />
                  )}
                </Segment>
                {thisReviewLatestResponse && (
                  <ReviewCommentResponseComponent
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

interface InformationComponentProps {
  summaryProps: SummaryViewWrapperPropsNEW
}

const InformationComponent: React.FC<InformationComponentProps> = ({ summaryProps }) => (
  <Grid>
    <Grid.Column stretched>
      <SummaryViewWrapperNEW {...summaryProps} />
    </Grid.Column>
  </Grid>
)

type SummaryComponentProps = InformationComponentProps & {
  canEdit: boolean
  linkToPage: string
  latestApplicationResponse: ApplicationResponse
  previousApplicationResponse: ApplicationResponse
}

const SummaryResponseComponent: React.FC<SummaryComponentProps> = ({
  canEdit,
  linkToPage,
  summaryProps,
}) => (
  <Grid columns="equal">
    <Grid.Column floated="left" width={4}>
      <SummaryViewWrapperNEW {...summaryProps} />
    </Grid.Column>
    <Grid.Column floated="right" textAlign="right">
      {canEdit && (
        <Button content={strings.BUTTON_SUMMARY_EDIT} size="small" as={Link} to={linkToPage} />
      )}
    </Grid.Column>
  </Grid>
)

const ChangedQuestionResponseComponent: React.FC<SummaryComponentProps> = ({
  canEdit,
  linkToPage,
  latestApplicationResponse,
  summaryProps,
}) => {
  const { push } = useRouter()
  return (
    <Grid>
      <Grid.Column floated="left" width={4}>
        <SummaryViewWrapperNEW {...summaryProps} />
      </Grid.Column>
      <Grid.Column width={4}>
        <Icon name="circle" size="tiny" color="blue" />
        <text style={reviewStatusStyle as CSSProperties}>Updated</text>
        <Label style={datePaddingStyle} size="mini">
          {getSimplifiedTimeDifference(latestApplicationResponse.timeUpdated)}
        </Label>
      </Grid.Column>
      <Grid.Column floated="right" textAlign="right" width={8}>
        {canEdit && <Icon name="edit" color="blue" size="small" onClick={() => push(linkToPage)} />}
      </Grid.Column>
    </Grid>
  )
}

const ChangedReviewResponseComponent: React.FC<SummaryComponentProps> = ({
  previousApplicationResponse,
  summaryProps,
}) => {
  const reviewResponse = previousApplicationResponse.reviewResponses.nodes?.[0]

  if (!reviewResponse) return null
  if (!reviewResponse?.decision) return null

  // If review was approved we don't need to show to the Applicant
  if (reviewResponse?.decision === ReviewResponseDecision.Approve) return null

  const { element, allResponses } = summaryProps

  return (
    <Grid>
      <Grid.Column floated="left" width={4}>
        <Label
          style={datePaddingStyle as CSSProperties}
          size="mini"
          content={getSimplifiedTimeDifference(reviewResponse.timeUpdated)}
        />
      </Grid.Column>
      <Grid.Column floated="left" width={12}>
        <SummaryViewWrapperNEW
          {...{
            element,
            allResponses,
            response: {
              id: previousApplicationResponse.id,
              text: previousApplicationResponse.value.text,
            },
            displayTitle: false,
          }}
        />
        <div style={changesRequestedStyles.body as CSSProperties}>
          <Icon name="comment alternate outline" color="grey" />
          <div style={commentMargin as CSSProperties}>{reviewResponse.comment || ''}</div>
        </div>
      </Grid.Column>
    </Grid>
  )
}

type ReviewComponentProps = InformationComponentProps & {
  isNewApplicationResponse: boolean
  latestApplicationResponse: ApplicationResponse
  thisReviewLatestResponse?: ReviewResponse
}

const ReviewQuestionResponseComponent: React.FC<ReviewComponentProps> = ({
  isNewApplicationResponse,
  summaryProps,
  thisReviewLatestResponse,
}) => (
  <Grid>
    <Grid.Column floated="left" width={4}>
      <SummaryViewWrapperNEW {...summaryProps} />
    </Grid.Column>
    <Grid.Column floated="right" textAlign="right">
      <ReviewButton
        isNewApplicationResponse={isNewApplicationResponse}
        reviewResponse={thisReviewLatestResponse as ReviewResponse}
        summaryViewProps={summaryProps}
      />
    </Grid.Column>
  </Grid>
)

const ReviewCommentResponseComponent: React.FC<{
  reviewResponse: ReviewResponse
  summaryViewProps: SummaryViewWrapperPropsNEW
  latestApplicationResponse: ApplicationResponse
}> = ({ reviewResponse, summaryViewProps, latestApplicationResponse }) => {
  const [toggleDecisionArea, setToggleDecisionArea] = useState(false)

  if (!reviewResponse) return null
  if (!reviewResponse?.decision) return null

  // After review is submitted, reviewResponses are trimmed if they are not changed duplicates
  // or if they are null, we only want to show reviewResponses that are linked to latestApplicationResponse
  if (latestApplicationResponse.id !== reviewResponse.applicationResponse?.id) return null

  return (
    <div style={reviewCommentStyle.sup}>
      <div style={reviewCommentStyle.reviewer}>
        {reviewResponse.review?.reviewer?.firstName} {reviewResponse.review?.reviewer?.lastName}
      </div>
      <div style={reviewCommentStyle.body as CSSProperties}>
        <div style={reviewCommentStyle.decision}>
          <Icon
            name="circle"
            size="tiny"
            color={reviewResponse?.decision === ReviewResponseDecision.Approve ? 'green' : 'red'}
          />
          <text style={reviewStatusStyle as CSSProperties}>
            {reviewResponse?.decision === ReviewResponseDecision.Approve
              ? 'Conform'
              : 'Non Conform'}
          </text>
          <Label style={datePaddingStyle} size="mini">
            {getSimplifiedTimeDifference(reviewResponse.timeUpdated)}
          </Label>
        </div>
        {!reviewResponse.comment ? null : (
          <div style={reviewCommentStyle.comment}>
            <Icon name="comment alternate outline" color="grey" />
            <div style={commentMargin}>{reviewResponse.comment}</div>
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
        style={inlineStyles}
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

// Styles - TODO: Move to LESS || Global class style (semantic)
const inlineStyles = ({ isChangeRequest }: { isChangeRequest?: boolean }) => ({
  segment: {
    borderRadius: 8,
    borderBottomLeftRadius: isChangeRequest ? 0 : 8,
    borderBottomRightRadius: isChangeRequest ? 0 : 8,
    background: isChangeRequest ? 'rgb(249, 255, 255)' : '#FFFFFF',
    border: 'none',
    boxShadow: 'none',
    margin: 10,
    marginBottom: isChangeRequest ? 0 : 10,
  },
  grid: {
    margin: 10,
    marginTop: 0,
    borderTop: '3px solid rgb(230, 230, 230)',
    borderBottom: '3px solid rgb(230, 230, 230)',
    backgroundColor: '#FFFFFF',
  },
  button: {
    letterSpacing: 0.8,
    fontWeight: 1000,
    fontSize: 17,
    background: 'none',
    color: '#003BFE',
    border: 'none',
    borderRadius: 8,
    textTransform: 'capitalize',
  },
})

const reviewStatusStyle = {
  fontWeight: 'bolder',
  fontSize: 16,
  marginRight: 10,
}

const datePaddingStyle = { padding: 6 }
const commentMargin = { marginLeft: 6 }

const reviewCommentStyle = {
  sup: {
    display: 'flex',
    background: 'rgb(249, 255, 255)',
    margin: 10,
    marginTop: 0,
    borderTop: '3px solid rgb(230, 230, 230)',
    borderBottom: '3px solid rgb(230, 230, 230)',
    padding: 14,
  },
  reviewer: { color: 'rgb(150, 150, 150)', marginRight: 20 },
  body: {
    flexGrow: 1,
    textAlign: 'left',
  },
  decision: { display: 'flex', alignItems: 'center' },
  comment: {
    color: 'grey',
    display: 'flex',
    margin: 6,
  },
}

const changesRequestedStyles = {
  body: {
    color: 'grey',
    display: 'flex',
    margin: 6,
  },
}

export default PageElements
