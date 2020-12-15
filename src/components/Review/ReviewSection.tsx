import React from 'react'
import { Button, Grid, Header, Icon, Segment } from 'semantic-ui-react'
import { SummaryViewWrapper } from '../../formElementPlugins'
import strings from '../../utils/constants'
import { ReviewResponseDecision, TemplateElementCategory } from '../../utils/generated/graphql'
import { ReviewQuestionDecision, SectionElementStates } from '../../utils/types'

interface ReviewSectionProps {
  reviewSection: SectionElementStates
  updatingResponses: boolean
  updateResponses: (props: ReviewQuestionDecision[]) => void
  canEdit: boolean
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  reviewSection,
  updatingResponses,
  updateResponses,
  canEdit,
}) => {
  const { section, pages } = reviewSection
  return (
    <Segment inverted style={{ backgroundColor: 'WhiteSmoke', margin: '15px 50px 0px' }}>
      <Header as="h2" content={`${section.title}`} style={{ color: 'Grey' }} />
      {Object.entries(pages).map(([pageName, elements]) => {
        const elementsToReview = elements
          .filter(({ review }) => review && review.decision === undefined)
          .map(({ review }) => review as ReviewQuestionDecision)

        return (
          <Segment basic>
            <Header as="h3" style={{ color: 'DarkGrey' }}>
              {pageName}
            </Header>
            {elements.map(({ element, response, review }) => {
              const { category, isVisible, isEditable } = element
              return isVisible ? (
                <Segment key={`ReviewSection_${element.code}`} style={{ margin: 10 }}>
                  <Grid columns={2} verticalAlign="middle">
                    <Grid.Row>
                      <Grid.Column width={13}>
                        {/* // TODO: Replace with SummaryViewWrapper */}
                        <Header>{element.title}</Header>
                        {response && <Segment basic>{response?.text}</Segment>}
                      </Grid.Column>
                      <Grid.Column width={3}>
                        {category === TemplateElementCategory.Question &&
                          isVisible &&
                          isEditable &&
                          canEdit &&
                          (review?.decision === undefined ? (
                            <Button size="small">{strings.BUTTON_REVIEW_RESPONSE}</Button>
                          ) : (
                            <Icon name="pencil square" color="blue" />
                          ))}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Segment>
              ) : null
            })}
            <Button
              color="blue"
              inverted
              style={{ margin: 10 }}
              loading={updatingResponses}
              onClick={() =>
                updateResponses(
                  elementsToReview.map((review) => ({
                    id: review.id,
                    decision: ReviewResponseDecision.Approve,
                    comment: '',
                  }))
                )
              }
            >{`${strings.BUTTON_REVIEW_APPROVE}(${elementsToReview.length})`}</Button>
          </Segment>
        )
      })}
    </Segment>
  )
}

export default ReviewSection
