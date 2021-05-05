import React, { CSSProperties, useRef } from 'react'
import { Accordion, Grid, Header, Icon, Sticky } from 'semantic-ui-react'
import { ResponsesByCode, SectionState, Page, ApplicationDetails } from '../../utils/types'
import { PageElements } from '../'

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
  const stickyRef = useRef(null)
  return (
    <div ref={stickyRef} key={`${section.details.id}`}>
      <Accordion className="summary-section">
        <Accordion.Title active={isActive} onClick={toggleSection}>
          <Sticky context={stickyRef} offset={135} bottomOffset={150}>
            <Grid columns="equal" className="summary-section-header">
              <Grid.Column>
                <Header as="h4" content={details.title} />
              </Grid.Column>
              <Grid.Column textAlign="right">
                {extraSectionTitleContent && extraSectionTitleContent(section)}
              </Grid.Column>
              <Grid.Column textAlign="right" width={1}>
                <Icon name={isActive ? 'angle up' : 'angle down'} size="large" />
              </Grid.Column>
            </Grid>
          </Sticky>
        </Accordion.Title>
        <Accordion.Content active={isActive}>
          {Object.values(pages).map((page) => (
            <div key={`${section.details.id}Page_${page.number}Container`}>
              {scrollableAttachment && scrollableAttachment(page)}
              <Header as="h6" className="summary-page-header">
                {page.name}
              </Header>
              <PageElements
                key={`${section.details.id}Page_${page.number}`}
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
            </div>
          ))}
        </Accordion.Content>
      </Accordion>
    </div>
  )
}

export default SectionWrapper
