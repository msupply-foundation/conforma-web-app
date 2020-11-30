import React, { useEffect, useState } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import { Loading, ProgressBar } from '../../components'
import { Grid, Label, Message, Segment } from 'semantic-ui-react'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import useGetResponsesAndElementState from '../../utils/hooks/useGetResponsesAndElementState'
import { ElementsBox, NavigationBox } from './'
import validatePage, { getCombinedStatus, PROGRESS_STATUS } from '../../utils/helpers/validatePage'
import { SummarySectionCode } from '../../utils/constants'

import {
  ApplicationElementStates,
  ProgressInApplication,
  ProgressInSection,
  ProgressInPage,
  ProgressStatus,
  ResponsesByCode,
  TemplateSectionPayload,
  ValidationMode,
} from '../../utils/types'

const ApplicationPageWrapper: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<TemplateSectionPayload>()
  const [progressInApplication, setProgressInApplication] = useState<ProgressInApplication>()
  const { query, push, replace } = useRouter()
  const { mode, serialNumber, sectionCode, page } = query

  const {
    error,
    loading,
    application,
    templateSections,
    appStatus,
    isApplicationLoaded,
  } = useLoadApplication({
    serialNumber: serialNumber as string,
  })

  const {
    error: responsesError,
    loading: responsesLoading,
    responsesByCode,
    elementsState,
  } = useGetResponsesAndElementState({
    serialNumber: serialNumber as string,
    isApplicationLoaded,
  })

  // Wait for application to be loaded to:
  // 1 - ProcessRedirect: Will redirect to summary in case application is SUBMITTED
  // 2 - Set the current section state of the application
  useEffect(() => {
    if (isApplicationLoaded) {
      processRedirect({
        ...appStatus,
        serialNumber,
        sectionCode,
        page,
        templateSections,
        push,
        replace,
      })

      if (sectionCode && page)
        setCurrentSection(templateSections.find(({ code }) => code === sectionCode))
    }
  }, [isApplicationLoaded, sectionCode, page])

  // Wait for loading (and evaluating elements and responses)
  // or a change of section/page to rebuild the progress bar
  useEffect(() => {
    if (responsesLoading) return

    const progressStructure = buildProgressInApplication({
      elementsState,
      responses: responsesByCode,
      templateSections,
      isLinear: application?.isLinear as boolean,
      currentSection: currentSection?.index as number,
      currentPage: Number(page),
    })
    setProgressInApplication(progressStructure)
  }, [responsesLoading, currentSection, page])

  const validateCurrentPage = (): boolean => {
    if (!application || !currentSection || !page) {
      console.log('Problem to validate - Undefined parameters')
      return false
    }

    const validation = validatePage({
      elementsState: elementsState as ApplicationElementStates,
      responses: responsesByCode as ResponsesByCode,
      currentSectionIndex: currentSection?.index as number,
      page: Number(page),
    })

    return application?.isLinear ? validation === (PROGRESS_STATUS.VALID as ProgressStatus) : true
  }

  return error || responsesError ? (
    <Message error header="Problem to load application" />
  ) : loading || responsesLoading ? (
    <Loading />
  ) : application && templateSections && serialNumber && currentSection && responsesByCode ? (
    <Segment.Group>
      <Grid stackable>
        <Grid.Column width={4}>
          {!progressInApplication ? (
            <Loading>Loading progress bar</Loading>
          ) : (
            <ProgressBar
              serialNumber={serialNumber as string}
              progressStructure={progressInApplication}
              currentSectionPage={{ sectionIndex: currentSection.index, currentPage: Number(page) }}
              validateCurrentPage={validateCurrentPage}
              push={push}
            />
          )}
        </Grid.Column>
        <Grid.Column width={12} stretched>
          <ElementsBox
            sectionTitle={currentSection.title}
            sectionIndex={currentSection.index}
            sectionPage={Number(page)}
            responsesByCode={responsesByCode}
            elementsState={elementsState as ApplicationElementStates}
          />
          <NavigationBox
            templateSections={templateSections}
            validateCurrentPage={validateCurrentPage}
          />
        </Grid.Column>
      </Grid>
    </Segment.Group>
  ) : (
    <Label content="Application's section can't be displayed" />
  )
}

function processRedirect(appState: any): void {
  // All logic for re-directing/configuring page based on application state, permissions, roles, etc. should go here.
  const {
    stage,
    status,
    outcome,
    serialNumber,
    sectionCode,
    page,
    templateSections,
    push,
    replace,
  } = appState
  if (status !== 'DRAFT') {
    replace(`/applications/${serialNumber}/summary`)
    return
  }
  if (!sectionCode || !page) {
    const firstSection = templateSections[0].code
    replace(`/applications/${serialNumber}/${firstSection}/page1`)
  }
}

interface buildProgressInApplicationProps {
  elementsState: ApplicationElementStates | undefined
  responses: ResponsesByCode | undefined
  templateSections: TemplateSectionPayload[]
  isLinear: boolean
  currentSection: number
  currentPage: number
  validationMode?: ValidationMode
}

function buildProgressInApplication({
  elementsState,
  responses,
  templateSections,
  isLinear,
  currentSection,
  currentPage,
  validationMode = 'LOOSE',
}: buildProgressInApplicationProps): ProgressInApplication {
  if (!elementsState || !responses) return []
  let previousSectionStatus: ProgressStatus = PROGRESS_STATUS.VALID
  let sectionsStructure: ProgressInApplication = templateSections.map((section) => {
    // Create an array with all pages in each section
    const pageNumbers = Array.from(Array(section.totalPages).keys(), (n) => n + 1)
    const isCurrentPage = (page: number) => section.index === currentSection && page === currentPage

    const getPageStatus = (sectionIndex: number, page: number) => {
      const draftPageStatus = validatePage({
        elementsState,
        responses,
        currentSectionIndex: sectionIndex,
        page,
      })
      if (isLinear || validationMode === 'STRICT')
        return draftPageStatus === PROGRESS_STATUS.VALID
          ? PROGRESS_STATUS.VALID
          : PROGRESS_STATUS.NOT_VALID
      return draftPageStatus
    }

    let previousPageStatus: ProgressStatus = PROGRESS_STATUS.VALID
    const pages: ProgressInPage[] = pageNumbers.map((pageNumber) => {
      const status = getPageStatus(section.index, pageNumber)
      const isPreviousPageValid = previousPageStatus === PROGRESS_STATUS.VALID

      previousPageStatus = status // Update new previous page for next iteration
      return {
        pageName: `Page ${pageNumber}`,
        canNavigate: isLinear ? isPreviousPageValid : true,
        isActive: isCurrentPage(pageNumber),
        status: isCurrentPage(pageNumber) ? PROGRESS_STATUS.INCOMPLETE : status,
      }
    })

    const sectionStatus = getCombinedStatus(pages.map(({ status }) => status))
    const isPreviousSectionValid = previousSectionStatus === PROGRESS_STATUS.VALID
    previousSectionStatus = sectionStatus

    // Build object to keep each section progress (and pages progress)
    // with section status as combined statuses of pages
    const progressInSection: ProgressInSection = {
      code: section.code,
      title: section.title,
      canNavigate: isLinear && (section.index <= currentSection || isPreviousSectionValid),
      isActive: section.index === currentSection,
      pages,
      status: section.index === currentSection ? PROGRESS_STATUS.INCOMPLETE : sectionStatus,
    }

    return progressInSection
  })

  // Add 'Review and submit' as last section
  sectionsStructure.push({
    code: SummarySectionCode,
    title: 'Review and submit',
    canNavigate: isLinear ? false : true,
    isActive: false,
  })

  return sectionsStructure
}

export default ApplicationPageWrapper
