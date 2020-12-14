import React from 'react'
import { Button, Card, Grid, Header, Segment } from 'semantic-ui-react'
import { SummaryViewWrapper } from '../../formElementPlugins'
import { TemplateElementCategory } from '../../utils/generated/graphql'
import { ResponsesByCode, SectionElementStates } from '../../utils/types'

interface ReviewSectionProps {
  reviewSection: SectionElementStates
  canEdit: boolean
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ reviewSection, canEdit }) => {
  const { section, pages } = reviewSection
  return (
    <Segment.Group size="large">
      <Header as="h2" content={`${section.title}`} />
      {Object.entries(pages).map(([pageName, elements]) => (
        <Segment key={`ReviewSection_${pageName}`}>
          <p>{pageName}</p>
          <Segment.Group>
            {elements.map(({ element, response, review }) => {
              const { category, isVisible, isEditable } = element
              return isVisible ? (
                <Segment key={`ReviewSection_${element.code}`}>
                  <Grid columns={2} verticalAlign="middle">
                    <Grid.Row>
                      <Grid.Column width={13}>
                        {/* // TODO: Replace with SummaryViewWrapper */}
                        <Card>
                          <Card.Header>{element.title}</Card.Header>
                          <Card.Content>{response?.text}</Card.Content>
                          <Card.Content extra>{review?.comment}</Card.Content>
                        </Card>
                      </Grid.Column>
                      <Grid.Column width={3}>
                        {category === TemplateElementCategory.Question &&
                          isVisible &&
                          isEditable &&
                          canEdit && <Button size="small">Review</Button>}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Segment>
              ) : null
            })}
          </Segment.Group>
        </Segment>
      ))}
    </Segment.Group>
  )
}

export default ReviewSection
