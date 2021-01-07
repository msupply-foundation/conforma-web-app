import React from 'react'
import { Button, Card, Container, Grid, Header, Icon, Label, Segment } from 'semantic-ui-react'
import { SummaryViewWrapper } from '../../formElementPlugins'
import { SummaryViewWrapperProps } from '../../formElementPlugins/types'
import strings from '../../utils/constants'
import { ReviewResponseDecision, TemplateElementCategory } from '../../utils/generated/graphql'
import {
  ReviewQuestionDecision,
  ResponsesByCode,
  SectionElementStates,
  DecisionAreaState,
} from '../../utils/types'

interface ReviewSectionProps {
  reviewer: string
  allResponses: ResponsesByCode
  assignedToYou: boolean
  reviewSection: SectionElementStates
  updateResponses: (props: ReviewQuestionDecision[]) => void
  setDecisionArea: (
    review: ReviewQuestionDecision,
    summaryViewProps: SummaryViewWrapperProps
  ) => void
  canEdit: boolean
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  reviewer,
  allResponses,
  assignedToYou,
  reviewSection,
  updateResponses,
  setDecisionArea,
  canEdit,
}) => {
  const { section, pages } = reviewSection

  const showSectionAssignment = assignedToYou ? (
    <Label style={{ backgroundColor: 'WhiteSmoke', color: 'Blue' }}>
      {strings.LABEL_ASSIGNED_TO_YOU}
    </Label>
  ) : (
    <Label style={{ backgroundColor: 'WhiteSmoke' }}>{strings.LABEL_ASSIGNED_TO_OTHER}</Label>
  )
  return (
    <Segment
      key={`ReviewSection_${section.code}`}
      inverted
      style={{ backgroundColor: 'WhiteSmoke', marginLeft: '10%', marginRight: '10%' }}
    >
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column>
            <Header as="h2" content={`${section.title}`} style={{ color: 'Grey' }} />
          </Grid.Column>
          <Grid.Column>
            <Container textAlign="right">{showSectionAssignment}</Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      {Object.entries(pages).map(([pageName, elements]) => {
        const elementsToReview = elements
          .filter(({ review }) => review && review.decision === undefined)
          .map(({ review }) => review as ReviewQuestionDecision)
        const reviewsNumber = elementsToReview.length

        return (
          <Segment key={`ReviewSection_${section.code}_${pageName}`} basic>
            <Header as="h3" style={{ color: 'DarkGrey' }}>
              {pageName}
            </Header>
            {elements.map(({ element, response, review }) => {
              const { category } = element
              const summaryViewProps = {
                element,
                response,
                allResponses,
              }
              if (category === TemplateElementCategory.Question) {
                return (
                  <Segment
                    key={`ReviewElement_${element.code}`}
                    style={{ margin: '10px 50px 0px' }}
                  >
                    <Grid columns={2} verticalAlign="middle">
                      <Grid.Row>
                        <Grid.Column>
                          <SummaryViewWrapper {...summaryViewProps} />
                        </Grid.Column>
                        <Grid.Column>
                          {review && canEdit && (
                            <Container textAlign="right">
                              {review?.decision === undefined && (
                                <Button
                                  size="small"
                                  onClick={() => setDecisionArea(review, summaryViewProps)}
                                  content={strings.BUTTON_REVIEW_RESPONSE}
                                />
                              )}
                            </Container>
                          )}
                        </Grid.Column>
                      </Grid.Row>
                      {review && review.decision && (
                        <Grid.Row>
                          <Card fluid>
                            <Card.Content>
                              <Grid>
                                <Grid.Row>
                                  <Grid.Column width="10">
                                    <Card.Header>{review.decision}</Card.Header>
                                    <Card.Description>{review.comment}</Card.Description>
                                    <Card.Meta>{reviewer}</Card.Meta>
                                  </Grid.Column>
                                  <Grid.Column width="2">
                                    <Icon
                                      name="pencil square"
                                      color="blue"
                                      style={{ minWidth: 100 }}
                                      onClick={() => setDecisionArea(review, summaryViewProps)}
                                    />
                                  </Grid.Column>
                                </Grid.Row>
                              </Grid>
                            </Card.Content>
                          </Card>
                        </Grid.Row>
                      )}
                    </Grid>
                  </Segment>
                )
              }
            })}
            {reviewsNumber > 0 && (
              <Button
                color="blue"
                inverted
                style={{ margin: 10 }}
                onClick={() => {
                  updateResponses(
                    elementsToReview.map((review) => ({
                      id: review.id,
                      decision: ReviewResponseDecision.Approve,
                      comment: '',
                    }))
                  )
                }}
              >{`${strings.BUTTON_REVIEW_APPROVE_ALL}(${reviewsNumber})`}</Button>
            )}
          </Segment>
        )
      })}
    </Segment>
  )
}

export default ReviewSection
