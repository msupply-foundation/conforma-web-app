import React from 'react'
import { Button, Segment, Sticky } from 'semantic-ui-react'
import {
  MethodRevalidate,
  MethodToCallProps,
  SectionAndPage,
  SectionDetails,
  SectionsStructureNEW,
} from '../../utils/types'
import strings from '../../utils/constants'
import { useRouter } from '../../utils/hooks/useRouter'

interface NavigationProps {
  current: SectionAndPage
  sections: SectionsStructureNEW
  serialNumber: string
  requestRevalidation: MethodRevalidate
}

const Navigation: React.FC<NavigationProps> = ({
  current,
  sections,
  serialNumber,
  requestRevalidation,
}) => {
  const { push } = useRouter()

  const currentSectionDetails = sections[current.sectionCode].details

  const nextSection = (): SectionDetails | null => {
    const nextSections = Object.values(sections)
      .filter(({ details: { index } }) => index > currentSectionDetails.index)
      .sort(({ details: { index: aIndex } }, { details: { index: bIndex } }) => aIndex - bIndex)
    return nextSections.length > 0 ? nextSections[0].details : null
  }

  const previousSection = (): SectionDetails | null => {
    const previousSections = Object.values(sections)
      .filter(({ details: { index } }) => index < currentSectionDetails.index)
      .sort(({ details: { index: aIndex } }, { details: { index: bIndex } }) => bIndex - aIndex)
    return previousSections.length > 0 ? previousSections[0].details : null
  }

  const isFirstPage = current.pageNumber - 1 === 0 && previousSection() == null
  const isLastPage =
    current.pageNumber + 1 > currentSectionDetails.totalPages && nextSection() == null

  const getPreviousSectionPage = (): SectionAndPage => {
    const { sectionCode, pageNumber } = current
    if (pageNumber > 1) return { sectionCode, pageNumber: pageNumber - 1 }
    return {
      sectionCode: (previousSection() as SectionDetails).code,
      pageNumber: (previousSection() as SectionDetails).totalPages,
    }
  }

  const getNextSectionPage = (): SectionAndPage => {
    const { sectionCode, pageNumber } = current
    if (pageNumber < currentSectionDetails.totalPages)
      return { sectionCode, pageNumber: pageNumber + 1 }
    return {
      sectionCode: (nextSection() as SectionDetails).code,
      pageNumber: 1,
    }
  }

  const sendToPage = (sectionPage: SectionAndPage) => {
    const { sectionCode, pageNumber } = sectionPage
    push(`/applicationNEW/${serialNumber}/${sectionCode}/Page${pageNumber}`)
  }

  const previousButtonHandler = (_: any) => {
    const previousSectionPage = getPreviousSectionPage()
    sendToPage(previousSectionPage)
  }

  const nextPageButtonHandler = (_: any) => {
    const nextSectionPage = getNextSectionPage()
    // Use validationMethod to check if can change to page (on linear application) OR
    // display current page with strict validation
    requestRevalidation(({ firstStrictInvalidPage, setStrictSectionPage }: MethodToCallProps) => {
      if (
        firstStrictInvalidPage !== null &&
        current.sectionCode === firstStrictInvalidPage.sectionCode &&
        current.pageNumber === firstStrictInvalidPage.pageNumber
      ) {
        setStrictSectionPage(firstStrictInvalidPage)
      } else {
        setStrictSectionPage(null)
        sendToPage(nextSectionPage)
      }
    })
  }

  return (
    <Sticky
      pushing
      style={{ backgroundColor: 'white', boxShadow: ' 0px -5px 8px 0px rgba(0,0,0,0.1)' }}
    >
      <Segment.Group horizontal>
        <Segment style={{ minWidth: '50%' }}>
          {!isFirstPage && (
            <Button
              basic
              floated="left"
              onClick={previousButtonHandler}
              content={strings.BUTTON_PREVIOUS}
            />
          )}
          {!isLastPage && (
            <Button
              basic
              floated="right"
              onClick={nextPageButtonHandler}
              content={strings.BUTTON_NEXT}
            />
          )}
        </Segment>
        <Segment basic textAlign="center" clearing>
          <Button
            color="blue"
            onClick={() => {
              /* TO-DO */
            }}
            content={strings.BUTTON_SUMMARY}
          />
        </Segment>
      </Segment.Group>
    </Sticky>
  )
}

export default Navigation
