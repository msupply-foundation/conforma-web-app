import React, { CSSProperties, useRef } from 'react'
import { Accordion, Grid, Header, Icon, Sticky } from 'semantic-ui-react'
import { ResponsesByCode, SectionState, Page, ApplicationDetails } from '../../utils/types'
import { PageElements } from '../'

interface SectionProps {
  toggleSection: () => void
  extraSectionTitleContent?: (section: SectionState) => React.ReactNode
  extraPageContent?: (page: Page) => React.ReactNode
  scrollableAttachment?: (page: Page) => React.ReactNode
  section: SectionState
  responsesByCode: ResponsesByCode
  applicationData: ApplicationDetails
  isActive: boolean
  isReview?: boolean
  isSummary?: boolean
  serial: string
  canEdit?: boolean
  failed?: boolean
}

const SectionWrapper: React.FC<SectionProps> = ({
  toggleSection,
  extraSectionTitleContent,
  extraPageContent,
  scrollableAttachment,
  section,
  responsesByCode,
  applicationData,
  isActive,
  isReview,
  isSummary,
  serial,
  canEdit,
  failed,
}) => {
  const { details, pages } = section
  const stickyRef = useRef(null)
  return (
    <div ref={stickyRef} key={`${section.details.id}`}>
      <Accordion className="summary-section" style={sectionStyles.sup(!!failed)}>
        <Accordion.Title active={isActive} onClick={toggleSection}>
          <Sticky context={stickyRef} offset={134} bottomOffset={150}>
            <Grid columns="equal" className="summary-section-header">
              <Grid.Column width={10}>
                <Header as="h4" content={details.title} />
              </Grid.Column>
              <Grid.Column textAlign="left">
                {extraSectionTitleContent && extraSectionTitleContent(section)}
              </Grid.Column>
              <Grid.Column textAlign="right" width={1}>
                <Icon
                  name={isActive ? 'angle up' : 'angle down'}
                  className="dark-grey"
                  size="large"
                />
              </Grid.Column>
            </Grid>
          </Sticky>
        </Accordion.Title>
        <Accordion.Content active={isActive}>
          {Object.values(pages).map((page) => (
            <div key={`${section.details.id}Page_${page.number}Container`} className="summary-page">
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

// Styles - TODO: Move to LESS || Global class style (semantic)
const sectionStyles = {
  sup: (failed: boolean) =>
    ({
      border: failed ? '2px solid pink' : 'none',
    } as CSSProperties),
}

export default SectionWrapper
