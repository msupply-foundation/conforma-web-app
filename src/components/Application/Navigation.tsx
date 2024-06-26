import React, { useEffect, useState } from 'react'
import { Button, Container, Dropdown, Icon, Loader } from 'semantic-ui-react'
import {
  MethodRevalidate,
  MethodToCallProps,
  SectionAndPage,
  SectionDetails,
  SectionsStructure,
} from '../../utils/types'
import { useLanguageProvider } from '../../contexts/Localisation'
import { useRouter } from '../../utils/hooks/useRouter'
import { useViewport } from '../../contexts/ViewportState'
import { useFormElementUpdateTracker } from '../../contexts/FormElementUpdateTrackerState'

interface NavigationProps {
  current: SectionAndPage
  isLinear: boolean
  sections: SectionsStructure
  serialNumber: string
  requestRevalidation: MethodRevalidate
  isValidating: boolean
}

const Navigation: React.FC<NavigationProps> = ({
  current,
  isLinear,
  sections,
  serialNumber,
  requestRevalidation,
  isValidating,
}) => {
  const { t } = useLanguageProvider()
  const { push } = useRouter()
  const { isMobile } = useViewport()
  const {
    state: { elementCurrentlyProcessing },
  } = useFormElementUpdateTracker()
  const [navigateToIfAllOk, setNavigateToIfAllOk] = useState<
    null | 'summary' | 'nextPage' | string
  >(null)

  const currentSectionDetails = sections[current.sectionCode].details

  const nextSections = Object.values(sections)
    .filter(({ details: { active, index } }) => active && index > currentSectionDetails.index)
    .sort(({ details: { index: aIndex } }, { details: { index: bIndex } }) => aIndex - bIndex)
  const nextSection = nextSections.length > 0 ? nextSections[0].details : null

  const previousSections = Object.values(sections)
    .filter(({ details: { active, index } }) => active && index < currentSectionDetails.index)
    .sort(({ details: { index: aIndex } }, { details: { index: bIndex } }) => bIndex - aIndex)
  const previousSection = previousSections.length > 0 ? previousSections[0].details : null

  const isFirstPage = current.pageNumber - 1 === 0 && previousSection == null
  const isLastPage =
    current.pageNumber + 1 > currentSectionDetails.totalPages && nextSection == null

  useEffect(() => {
    if (elementCurrentlyProcessing.size > 0 || !navigateToIfAllOk) return

    switch (navigateToIfAllOk) {
      case 'summary': {
        requestRevalidation(
          ({ firstStrictInvalidPage, setStrictSectionPage }: MethodToCallProps) => {
            if (firstStrictInvalidPage) {
              setStrictSectionPage(firstStrictInvalidPage)
              setNavigateToIfAllOk(null)
              sendToPage(firstStrictInvalidPage)
            } else {
              setNavigateToIfAllOk(null)
              push(`/application/${serialNumber}/summary`)
            }
          }
        )
        break
      }
      case 'nextPage': {
        // Use validationMethod to check if can change to page (on linear
        // application) OR display current page with strict validation
        requestRevalidation(
          ({ firstStrictInvalidPage, setStrictSectionPage }: MethodToCallProps) => {
            if (
              firstStrictInvalidPage !== null &&
              current.sectionCode === firstStrictInvalidPage.sectionCode &&
              current.pageNumber === firstStrictInvalidPage.pageNumber
            ) {
              setNavigateToIfAllOk(null)
              setStrictSectionPage(firstStrictInvalidPage)
            } else {
              setStrictSectionPage(null)
              setNavigateToIfAllOk(null)
              sendToPage(getNextSectionPage())
            }
          }
        )
        break
      }
      // Jump to specific section
      default: {
        requestRevalidation(
          ({ firstStrictInvalidPage, setStrictSectionPage }: MethodToCallProps) => {
            const firstInvalidSectionIndex = Object.values(sections).find(
              (section) => section.details.code === firstStrictInvalidPage?.sectionCode
            )?.details.index

            if (
              firstStrictInvalidPage !== null &&
              firstInvalidSectionIndex &&
              firstInvalidSectionIndex > currentSectionDetails.index
            ) {
              setStrictSectionPage(firstStrictInvalidPage)
              sendToPage(firstStrictInvalidPage)
            } else {
              const [sectionCode, pageNumber] = navigateToIfAllOk.split('___')
              setStrictSectionPage(null)
              setNavigateToIfAllOk(null)
              sendToPage({ sectionCode, pageNumber: Number(pageNumber) })
            }
          }
        )
      }
    }
  }, [elementCurrentlyProcessing, navigateToIfAllOk])

  const getPreviousSectionPage = (): SectionAndPage => {
    const { sectionCode, pageNumber } = current
    if (pageNumber > 1) return { sectionCode, pageNumber: pageNumber - 1 }
    return {
      sectionCode: (previousSection as SectionDetails).code,
      pageNumber: (previousSection as SectionDetails).totalPages,
    }
  }

  const getNextSectionPage = (): SectionAndPage => {
    const { sectionCode, pageNumber } = current
    if (pageNumber < currentSectionDetails.totalPages)
      return { sectionCode, pageNumber: pageNumber + 1 }
    return {
      sectionCode: (nextSection as SectionDetails).code,
      pageNumber: 1,
    }
  }

  const sendToPage = (sectionPage: SectionAndPage) => {
    const { sectionCode, pageNumber } = sectionPage
    push(`/application/${serialNumber}/${sectionCode}/Page${pageNumber}`)
    window.scrollTo({ top: 0 })
  }

  const previousButtonHandler = () => {
    const previousSectionPage = getPreviousSectionPage()
    sendToPage(previousSectionPage)
    window.scrollTo({ top: 0 })
  }

  const nextPageButtonHandler = () => {
    if (!isLinear) {
      sendToPage(getNextSectionPage())
      window.scrollTo({ top: 0 })
      return
    }

    setNavigateToIfAllOk('nextPage')
  }

  const sectionJumpHandler = (sectionPage: SectionAndPage) => {
    if (sectionPage.sectionCode === '__INTRO__') {
      push(`/application/${serialNumber}`)
      return
    }

    if (
      !isLinear ||
      previousSections.find((section) => section.details.code === sectionPage.sectionCode)
    ) {
      sendToPage(sectionPage)
      return
    }

    const { sectionCode, pageNumber } = sectionPage
    setNavigateToIfAllOk(`${sectionCode}___${pageNumber}`)
  }

  const sectionOptions = Object.values(sections).map(({ details }) => ({
    key: details.code,
    text: details.title,
    value: details.code,
  }))

  const showLoader = isValidating || (elementCurrentlyProcessing.size > 0 && !!navigateToIfAllOk)

  return (
    <Container>
      <div id="app-navigation-content">
        <div className="prev-next-links">
          <p className={`clickable nav-button ${isFirstPage ? 'invisible' : ''}`}>
            <a onClick={previousButtonHandler}>
              <strong>{t('BUTTON_PREVIOUS')}</strong>
            </a>
          </p>
          <p className={`clickable nav-button ${isLastPage ? 'invisible' : ''}`}>
            <a onClick={nextPageButtonHandler}>
              <strong>{t('BUTTON_NEXT')}</strong>
            </a>
          </p>
        </div>
        <div className="button-container">
          <Button
            primary
            inverted={isValidating}
            disabled={showLoader}
            onClick={() => setNavigateToIfAllOk('summary')}
          >
            {showLoader ? t('BUTTON_VALIDATING') : t('BUTTON_SUMMARY')}
            {showLoader && <Loader active inline size="tiny" />}
          </Button>
        </div>
        {isMobile && sectionOptions.length > 1 && (
          <div
            className="flex-row-start-center smaller-text nav-button"
            style={{ gap: 5, flexWrap: 'wrap', width: '100%' }}
          >
            {t('NAVIGATION_GO_TO')}:
            <Dropdown
              selection
              options={[
                { key: 'intro-page', text: 'Introduction', value: '__INTRO__' },
                ...sectionOptions,
              ]}
              value={current.sectionCode}
              onChange={(_, { value }) =>
                sectionJumpHandler({ sectionCode: value as string, pageNumber: 1 })
              }
            />
          </div>
        )}
      </div>
    </Container>
  )
}

export default Navigation
