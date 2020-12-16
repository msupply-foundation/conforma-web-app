import React from 'react'
import { Button, Grid, Header, Segment } from 'semantic-ui-react'
import { SummaryViewWrapper } from '../../formElementPlugins'
import { TemplateElementCategory } from '../../utils/generated/graphql'
import { ResponsesByCode, SectionElementStates } from '../../utils/types'

interface ReviewSectionProps {
  allResponses: ResponsesByCode
  reviewSection: SectionElementStates
  canEdit: boolean
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ reviewSection, allResponses, canEdit }) => {
  const { section, pages } = reviewSection
  return (
    <Segment
      key={`ReviewSection_${section.code}`}
      inverted
      style={{ backgroundColor: 'WhiteSmoke', margin: '15px 50px 0px' }}
    >
      <Header as="h2" content={`${section.title}`} style={{ color: 'Grey' }} />
      {Object.entries(pages).map(([pageName, elements]) => (
        <Segment key={`ReviewSection_${section.code}_${pageName}`} basic>
          <Header as="h3" style={{ color: 'DarkGrey' }}>
            {pageName}
          </Header>
          {elements.map(({ element, response, review }) => {
            const { category } = element
            const summaryViewProps = { element, response, allResponses, isStrictValidation: false }
            return (
              <Segment key={`ReviewElement_${element.code}`} style={{ margin: 10 }}>
                <Grid columns={2} verticalAlign="middle">
                  <Grid.Row>
                    <Grid.Column width={13}>
                      <SummaryViewWrapper {...summaryViewProps} />
                    </Grid.Column>
                    <Grid.Column width={3}>
                      {category === TemplateElementCategory.Question && canEdit && (
                        <Button size="small">Review</Button>
                      )}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            )
          })}
        </Segment>
      ))}
    </Segment>
  )
}

export default ReviewSection
