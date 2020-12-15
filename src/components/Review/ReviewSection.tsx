import React from 'react'
import { Button, Grid, Header, Segment } from 'semantic-ui-react'
import { SummaryViewWrapper } from '../../formElementPlugins'
import strings from '../../utils/constants'
import { TemplateElementCategory } from '../../utils/generated/graphql'
import { SectionElementStates } from '../../utils/types'

interface ReviewSectionProps {
  reviewSection: SectionElementStates
  canEdit: boolean
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ reviewSection, canEdit }) => {
  const { section, pages } = reviewSection
  return (
    <Segment inverted style={{ backgroundColor: 'WhiteSmoke', margin: '15px 50px 0px' }}>
      <Header as="h2" content={`${section.title}`} style={{ color: 'Grey' }} />
      {Object.entries(pages).map(([pageName, elements]) => {
        const elementsToReview = elements.filter(
          ({ review }) => review && review.decision === undefined
        ).length

        console.log(elements, elementsToReview)
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
                          canEdit && <Button size="small">Review</Button>}
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
            >{`${strings.BUTTON_REVIEW_APPROVE}(${elementsToReview})`}</Button>
          </Segment>
        )
      })}
    </Segment>
  )
}

export default ReviewSection
