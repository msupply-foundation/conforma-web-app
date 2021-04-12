import React from 'react'
import { Accordion, Segment, Grid, Header, Icon } from 'semantic-ui-react'
import { PageElements } from '.'
import { ResponsesByCode, SectionState, Page, ApplicationDetails } from '../../utils/types'

interface SectionProps {
  section: SectionState
  extraSectionTitleContent?: (section: SectionState) => React.ReactNode
  extraPageContent?: (page: Page) => React.ReactNode
  scrollableAttachment?: (page: Page) => React.ReactNode
  responsesByCode: ResponsesByCode
  applicationData: ApplicationDetails
  isReview?: boolean
  serial: string
  isSummary?: boolean
  isActive: boolean
  toggleSection: () => void
  canEdit?: boolean
}

const SectionWrapper: React.FC<SectionProps> = ({
  section,
  responsesByCode,
  applicationData,
  isActive,
  toggleSection,
  extraSectionTitleContent,
  extraPageContent,
  isReview,
  serial,
  isSummary,
  scrollableAttachment,
  canEdit,
}) => {
  const { details, pages } = section

  return (
    <Accordion styled fluid>
      <Segment.Group size="large">
        <Accordion.Title active={isActive} onClick={toggleSection}>
          <Grid columns="equal">
            <Grid.Column floated="left">
              <Header as="h2" content={details.title} />
            </Grid.Column>
            <Grid.Column floated="right" textAlign="right">
              {extraSectionTitleContent && extraSectionTitleContent(section)}
            </Grid.Column>
            <Grid.Column floated="right" textAlign="right" width={1}>
              <Icon name={isActive ? 'angle up' : 'angle down'} size="large" />
            </Grid.Column>
          </Grid>
        </Accordion.Title>
        <Accordion.Content active={isActive}>
          {Object.values(pages).map((page) => (
            <Segment key={`Page_${page.number}`}>
              {scrollableAttachment && scrollableAttachment(page)}
              <p>{page.name}</p>
              <PageElements
                elements={page.state}
                responsesByCode={responsesByCode}
                applicationData={applicationData}
                isReview={isReview}
                serial={serial}
                sectionAndPage={{ sectionCode: details.code, pageNumber: page.number }}
                isSummary={isSummary}
                canEdit={canEdit}
              />

              {extraPageContent && extraPageContent(page)}
            </Segment>
          ))}
        </Accordion.Content>
      </Segment.Group>
    </Accordion>
  )
}

export default SectionWrapper
