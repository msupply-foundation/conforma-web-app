import React, { CSSProperties, useRef } from 'react'
import { Accordion, Grid, Header, Icon, Sticky } from 'semantic-ui-react'
import { PageElements } from '.'
import { ResponsesByCode, SectionState, Page } from '../../utils/types'

interface SectionProps {
  section: SectionState
  extraSectionTitleContent?: (section: SectionState) => React.ReactNode
  extraPageContent?: (page: Page) => React.ReactNode
  scrollableAttachment?: (page: Page) => React.ReactNode
  responsesByCode: ResponsesByCode
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
      <Accordion fluid style={inlineStyles}>
        <Accordion.Title active={isActive} onClick={toggleSection}>
          <Sticky context={stickyRef} offset={135} bottomOffset={150}>
            <Grid columns="equal" style={inlineStyles}>
              <Grid.Column floated="left">
                <Header as="h2" content={details.title} style={sectionTitleStyle} />
              </Grid.Column>
              <Grid.Column floated="right" textAlign="right">
                {extraSectionTitleContent && extraSectionTitleContent(section)}
              </Grid.Column>
              <Grid.Column floated="right" textAlign="right" width={1}>
                <Icon
                  style={sectionIconStyle}
                  name={isActive ? 'angle up' : 'angle down'}
                  size="large"
                />
              </Grid.Column>
            </Grid>
          </Sticky>
        </Accordion.Title>
        <Accordion.Content active={isActive}>
          {Object.values(pages).map((page) => (
            <>
              {scrollableAttachment && scrollableAttachment(page)}
              <p style={pageStyle as CSSProperties}>{page.name}</p>
              <PageElements
                key={`${section.details.id}Page_${page.number}`}
                elements={page.state}
                responsesByCode={responsesByCode}
                isReview={isReview}
                serial={serial}
                sectionAndPage={{ sectionCode: details.code, pageNumber: page.number }}
                isSummary={isSummary}
                canEdit={canEdit}
              />

              {extraPageContent && extraPageContent(page)}
            </>
          ))}
        </Accordion.Content>
      </Accordion>
    </div>
  )
}

// Styles - TODO: Move to LESS || Global class style (semantic)
const inlineStyles = {
  acordion: {
    borderRadius: 8,
    marginBottom: 10,
    border: 'none',
    boxShadow: 'none',
    backgroundColor: '#DCDDDD', // Invision
    title: {
      sticky: {
        grid: {
          margin: 0,
          borderRadius: 8,
          backgroundColor: '#DCDDDD', // Invision
        },
      },
    },
  },
}

const sectionIconStyle = { color: 'rgb(100, 100, 100)' }

const sectionTitleStyle = {
  color: '#4A4A4A',
  fontSize: 18,
  fontWeight: 900,
  textTransform: 'uppercase',
  letterSpacing: 1,
}

const pageStyle = {
  color: '#4A4A4A',
  fontSize: 15,
  fontWeight: 900,
  textTransform: 'uppercase',
  letterSpacing: 1,
  marginTop: 8,
}

export default SectionWrapper
