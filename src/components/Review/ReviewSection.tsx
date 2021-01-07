import React, { createRef, useState } from 'react'
import {
  Button,
  Container,
  Grid,
  Header,
  Icon,
  Label,
  Segment,
  Sticky,
  Accordion,
} from 'semantic-ui-react'
import { SummaryViewWrapper } from '../../formElementPlugins'
import strings from '../../utils/constants'
import { ReviewResponseDecision, TemplateElementCategory } from '../../utils/generated/graphql'
import { ReviewQuestionDecision, ResponsesByCode, SectionElementStates } from '../../utils/types'

interface ReviewSectionProps {
  allResponses: ResponsesByCode
  assignedToYou: boolean
  reviewSection: SectionElementStates
  updateResponses: (props: ReviewQuestionDecision[]) => void
  canEdit: boolean
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  allResponses,
  assignedToYou,
  reviewSection,
  updateResponses,
  canEdit,
}) => {
  const { section, pages } = reviewSection
  const [isOpen, setIsOpen] = useState(false)

  // const contextRef: any = useRef()

  const showSectionAssignment = assignedToYou ? (
    <Label style={{ backgroundColor: 'WhiteSmoke', color: 'Blue' }}>
      {strings.LABEL_ASSIGNED_TO_YOU}
    </Label>
  ) : (
    <Label style={{ backgroundColor: 'WhiteSmoke' }}>{strings.LABEL_ASSIGNED_TO_OTHER}</Label>
  )

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <Accordion fluid>
      <Segment
        // ref={contextRef}
        key={`ReviewSection_${section.code}`}
        style={{
          backgroundColor: 'WhiteSmoke',
          marginLeft: '10%',
          marginRight: '10%',
        }}
      >
        <Accordion.Title active={isOpen} onClick={handleClick}>
          <Grid columns={3}>
            <Grid.Row>
              <Grid.Column width={12}>
                <Header as="h2" content={`${section.title}`} style={{ color: 'Grey' }} />
              </Grid.Column>
              <Grid.Column width={3}>
                <Container textAlign="right">{showSectionAssignment}</Container>
              </Grid.Column>
              <Grid.Column width={1}>
                <Icon name={isOpen ? 'angle up' : 'angle down'} size="large" />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Accordion.Title>
        <Accordion.Content active={isOpen}>
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
                        // style={{ margin: '10px 50px 0px' }}
                      >
                        <Grid columns={2} verticalAlign="middle">
                          <Grid.Row>
                            <Grid.Column>
                              <SummaryViewWrapper {...summaryViewProps} />
                            </Grid.Column>
                            <Grid.Column>
                              {review && canEdit && (
                                <Container textAlign="right">
                                  {review?.decision === undefined ? (
                                    <Button size="small">{strings.BUTTON_REVIEW_RESPONSE}</Button>
                                  ) : (
                                    <Icon
                                      name="pencil square"
                                      color="blue"
                                      style={{ minWidth: 100 }}
                                    />
                                  )}
                                </Container>
                              )}
                            </Grid.Column>
                          </Grid.Row>
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
        </Accordion.Content>
      </Segment>
    </Accordion>
  )
}

export default ReviewSection
