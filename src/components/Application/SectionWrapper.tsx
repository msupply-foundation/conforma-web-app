import React, { useEffect, useState } from 'react'
import { Accordion, Segment, Grid, Header, Icon, Button } from 'semantic-ui-react'
import { PageElements } from '.'
import { ReviewResponse } from '../../utils/generated/graphql'
import { useRouter } from '../../utils/hooks/useRouter'
import { ResponsesByCode, ElementStateNEW, SectionStateNEW, PageNEW } from '../../utils/types'

interface SectionProps {
  section: SectionStateNEW
  extraSectionTitleContent?: (section: SectionStateNEW) => React.ReactNode
  extraPageContent?: (page: PageNEW) => React.ReactNode
  scrollableAttachment?: (page: PageNEW) => React.ReactNode
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
