import React from 'react'
import { Container, Label, Segment } from 'semantic-ui-react'
import { SectionAndPage, SectionDetails, SectionsStructureNEW } from '../../utils/types'
import strings from '../../utils/constants'
import { useRouter } from '../../utils/hooks/useRouter'

interface NavigationProps {
  current: SectionAndPage
  sections: SectionsStructureNEW
  serialNumber: string
}

const Navigation: React.FC<NavigationProps> = ({ current, sections, serialNumber }) => {
  const { push } = useRouter()

  const currentSectionDetails = sections[current.sectionCode].details
  console.log('currentSection', currentSectionDetails)

  const hasNextSection = Object.values(sections).find(
    ({ details: { index } }) => index > currentSectionDetails.index
  )
  const hasPreviousSection = Object.values(sections).find(
    ({ details: { index } }) => index < currentSectionDetails.index
  )

  const isFirstPage = current.pageNumber - 1 === 0 && !hasPreviousSection
  const isLastPage = current.pageNumber + 1 > currentSectionDetails.totalPages && !hasNextSection

  const getPreviousSectionPage = (): SectionAndPage => {
    const { sectionCode, pageNumber } = current
    if (pageNumber >= 1) return { sectionCode, pageNumber: pageNumber - 1 }
    else {
      const previousSectionDetails = Object.values(sections).reduce(
        (previousSection: SectionDetails, { details: { code, index } }) => {
          if (index < previousSection.index) return sections[code].details
          return previousSection
        },
        currentSectionDetails
      )
      return {
        sectionCode: previousSectionDetails.code,
        pageNumber: previousSectionDetails.totalPages,
      }
    }
  }

  const getNextSectionPage = (): SectionAndPage => {
    const { sectionCode, pageNumber } = current
    if (pageNumber < currentSectionDetails.totalPages)
      return { sectionCode, pageNumber: pageNumber + 1 }
    else {
      const nextSectionDetails = Object.values(sections).reduce(
        (nextSection: SectionDetails, { details: { code, index } }) => {
          if (index > nextSection.index) return sections[code].details
          return nextSection
        },
        currentSectionDetails
      )
      return {
        sectionCode: nextSectionDetails.code,
        pageNumber: 1,
      }
    }
  }

  const sendToPage = (sectionPage: SectionAndPage) => {
    const { sectionCode, pageNumber } = sectionPage
    push(`/application/${serialNumber}/${sectionCode}/Page${pageNumber}`)
  }

  const previousButtonHandler = (_: any) => {
    const previousSectionPage = getPreviousSectionPage()
    sendToPage(previousSectionPage)
  }

  const nextPageButtonHandler = (_: any) => {
    const nextSectionPage = getNextSectionPage()
    sendToPage(nextSectionPage)
  }

  return (
    <Container>
      <Segment.Group>
        <Segment basic floated="left">
          {!isFirstPage && (
            <Label basic as="a" onClick={previousButtonHandler}>
              {strings.BUTTON_PREVIOUS}
            </Label>
          )}
        </Segment>
        <Segment basic floated="right">
          {!isLastPage && (
            <Label basic as="a" onClick={nextPageButtonHandler}>
              {strings.BUTTON_NEXT}
            </Label>
          )}
        </Segment>
      </Segment.Group>
      {/* TODO: Add "Summary & Review" button and Stick component */}
    </Container>
  )
}

export default Navigation
