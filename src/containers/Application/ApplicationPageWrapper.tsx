import React, { useEffect, useState } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import { Loading, ProgressBar } from '../../components'
import { Grid, Label, Message, Segment } from 'semantic-ui-react'
import { ElementsBox, NavigationBox } from './'
import validatePage, { getCombinedStatus, PROGRESS_STATUS } from '../../utils/helpers/validatePage'

import useLoadApplication from '../../utils/hooks/useLoadApplication'
import useGetResponsesAndElementState from '../../utils/hooks/useGetResponsesAndElementState'

import {
  ApplicationElementStates,
  ProgressInApplication,
  ProgressInSection,
  ProgressStatus,
  ResponsesByCode,
  ResponsesFullByCode,
  ReviewCode,
  TemplateSectionPayload,
} from '../../utils/types'

const ApplicationPageWrapper: React.FC = () => {
  const [loadPage, setLoadPage] = useState(false)
  const [currentSection, setCurrentSection] = useState<TemplateSectionPayload>()
  const [processingValidation, setProcessingValidation] = useState(true)
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
    responsesFullByCode,
    elementsState,
  } = useGetResponsesAndElementState({
    serialNumber: serialNumber as string,
    isApplicationLoaded,
  })

  useEffect(() => {
    console.log('isApplicationLoaded', isApplicationLoaded)

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

  useEffect(() => {
    console.log('elementsState', elementsState, 'currentSection', currentSection, 'page', page)

    const progressStructure = buildProgressInApplication({
      elementsState,
      responses: responsesFullByCode,
      templateSections,
      isLinear: application?.isLinear as boolean,
      currentSection: currentSection?.index as number,
      currentPage: Number(page),
    })
    setProgressInApplication(progressStructure)
    setProcessingValidation(false)

    console.log('responsesFullByCode', responsesFullByCode)

    if (
      serialNumber !== undefined &&
      elementsState !== undefined &&
      currentSection !== undefined &&
      responsesByCode !== undefined &&
      responsesFullByCode !== undefined
    )
      setLoadPage(true)
  }, [serialNumber, elementsState, currentSection, responsesByCode, responsesFullByCode, page])

  const validateCurrentPage = (): boolean => {
    if (!application || !currentSection || !page) {
      console.log('Problem to validate - Undefined parameters')
      return false
    }
    setProcessingValidation(true)

    const validation = validatePage({
      elementsState: elementsState as ApplicationElementStates,
      responses: responsesFullByCode as ResponsesFullByCode,
      sectionIndex: currentSection?.index as number,
      page: Number(page),
      checkEmpty: true,
    })
    setProcessingValidation(false)

    return application?.isLinear ? validation === (PROGRESS_STATUS.VALID as ProgressStatus) : true
  }

  return error || responsesError ? (
    <Message error header="Problem to load application" />
  ) : loading || responsesLoading ? (
    <Loading />
  ) : loadPage ? (
    <Segment.Group>
      <Grid stackable>
        <Grid.Column width={4}>
          {processingValidation || !progressInApplication ? (
            <Loading>Loading progress bar</Loading>
          ) : (
            <ProgressBar
              serialNumber={serialNumber as string}
              progressStructure={progressInApplication}
              currentSectionPage={{
                sectionIndex: currentSection?.index as number,
                currentPage: Number(page),
              }}
              validateCurrentPage={validateCurrentPage}
              push={push}
            />
          )}
        </Grid.Column>
        <Grid.Column width={12} stretched>
          <ElementsBox
            serialNumber={serialNumber as string}
            sectionTitle={currentSection?.title as string}
            sectionTemplateId={currentSection?.id as number}
            sectionPage={Number(page)}
            responsesByCode={responsesByCode as ResponsesByCode}
            responsesFullByCode={responsesFullByCode as ResponsesFullByCode}
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
  responses: ResponsesFullByCode | undefined
  templateSections: TemplateSectionPayload[]
  isLinear: boolean
  currentSection: number
  currentPage: number
}

function buildProgressInApplication({
  elementsState,
  responses,
  templateSections,
  isLinear,
  currentSection,
  currentPage,
}: buildProgressInApplicationProps): ProgressInApplication {
  if (!elementsState || !responses) return []

  let sectionsStructure: ProgressInApplication = templateSections.map((section) => {
    // Create an array with all pages in each section
    const pages = Array.from(Array(section.totalPages).keys(), (n) => n + 1)
    const canNavigateToPage = (index: number, page: number) =>
      index < currentSection ? true : index === currentSection && page <= currentPage

    // Build object to keep each section progress (and pages progress)
    const progressInSection: ProgressInSection = {
      code: section.code,
      title: section.title,
      canNavigate: isLinear ? section.index <= currentSection : true,
      isActive: section.index === currentSection,
      // pages: [],
      pages: pages.map((number) => ({
        pageName: `Page ${number}`,
        canNavigate: isLinear ? canNavigateToPage(section.index, number) : true,
        isActive: section.index === currentSection && number === currentPage,
        status: isLinear
          ? canNavigateToPage(section.index, number)
            ? validatePage({
                elementsState,
                responses,
                sectionIndex: section.index,
                page: number,
              })
            : PROGRESS_STATUS.INCOMPLETE
          : validatePage({
              elementsState,
              responses,
              sectionIndex: section.index,
              page: number,
            }),
      })),
    }

    // Return each section with status as the combination of its pages statuses
    return {
      ...progressInSection,
      status: getCombinedStatus(progressInSection.pages),
    }
  })

  // Add 'Review and submit' as last section
  sectionsStructure.push({
    code: 'PR' as ReviewCode,
    title: 'Review and submit',
    canNavigate: isLinear ? false : true,
    isActive: false,
  })

  return sectionsStructure
}

export default ApplicationPageWrapper
