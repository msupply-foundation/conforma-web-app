import React, { useRef } from 'react'
import { Accordion, Header, Icon, Ref, Sticky } from 'semantic-ui-react'
import {
  ResponsesByCode,
  SectionState,
  Page,
  ApplicationDetails,
  StageDetails,
  ReviewDetails,
} from '../../utils/types'
import { useUserState } from '../../contexts/UserState'
import styleConstants from '../../utils/data/styleConstants'
import { PageElements } from '../'

interface SectionProps {
  toggleSection: () => void
  extraSectionTitleContent?: (section: SectionState) => React.ReactNode
  extraPageContent?: (page: Page) => React.ReactNode
  scrollableAttachment?: (page: Page) => React.ReactNode
  section: SectionState
  responsesByCode: ResponsesByCode
  applicationData: ApplicationDetails
  stages: StageDetails[]
  isActive: boolean
  isConsolidation?: boolean
  reviewInfo?: ReviewDetails
  isSummary?: boolean
  isUpdating?: boolean
  serial: string
  canEdit?: boolean
  isSectionInvalid?: boolean
}

const SectionWrapper: React.FC<SectionProps> = ({
  toggleSection,
  extraSectionTitleContent,
  extraPageContent,
  scrollableAttachment,
  section,
  serial,
  responsesByCode,
  applicationData,
  stages,
  isActive,
  isConsolidation = false,
  reviewInfo,
  isSummary = false,
  isUpdating = false,
  canEdit = false,
  isSectionInvalid = false,
}) => {
  const { details, pages } = section
  const stickyRef = useRef(null)
  const {
    userState: { isNonRegistered },
  } = useUserState()

  const validationStateStyle = isSectionInvalid ? 'invalid-section' : ''

  return (
    <div key={`${section.details.id}`}>
      <Ref innerRef={stickyRef}>
        <Accordion className={`summary-section ${validationStateStyle}`}>
          <Accordion.Title active={isActive} onClick={toggleSection}>
            <Sticky
              context={stickyRef}
              offset={!isNonRegistered ? styleConstants.HEADER_OFFSET : 0}
              pushing
              active={isActive}
            >
              <div className="summary-section-header">
                <Header as="h4" content={details.title} />
                <div className="extra-content">
                  {extraSectionTitleContent && extraSectionTitleContent(section)}
                </div>
                <Icon name={isActive ? 'chevron up' : 'chevron down'} className="dark-grey" />
              </div>
            </Sticky>
          </Accordion.Title>
          <Accordion.Content active={isActive}>
            {Object.values(pages).map((page) => (
              <div
                key={`${section.details.id}Page_${page.number}Container`}
                className="summary-page"
              >
                {scrollableAttachment && scrollableAttachment(page)}
                <Header as="h6" className="summary-page-header">
                  {page.name}
                </Header>
                <PageElements
                  key={`${section.details.id}Page_${page.number}`}
                  elements={page.state}
                  responsesByCode={responsesByCode}
                  applicationData={applicationData}
                  stages={stages}
                  serial={serial}
                  sectionAndPage={{ sectionCode: details.code, pageNumber: page.number }}
                  reviewInfo={reviewInfo}
                  isConsolidation={isConsolidation}
                  isSummary={isSummary}
                  isUpdating={isUpdating}
                  canEdit={canEdit}
                />
                {extraPageContent && extraPageContent(page)}
              </div>
            ))}
          </Accordion.Content>
        </Accordion>
      </Ref>
    </div>
  )
}

export default SectionWrapper
