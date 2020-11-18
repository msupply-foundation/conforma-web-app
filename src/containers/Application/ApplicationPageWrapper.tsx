import React, { useEffect, useState } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import { Loading, ProgressBar } from '../../components'
import { Grid, Label, Message, Segment } from 'semantic-ui-react'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import useGetResponsesAndElementState from '../../utils/hooks/useGetResponsesAndElementState'
import { ElementsBox, NavigationBox } from './'
import {
  ApplicationElementStates,
  ElementState,
  ProgressInApplication,
  ProgressInPage,
  ProgressInSection,
  ResponsesByCode,
  TemplateSectionPayload,
} from '../../utils/types'
import { TemplateElementCategory } from '../../utils/generated/graphql'

const ApplicationPageWrapper: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<TemplateSectionPayload>()
  const [loadingProgressBar, setLoadingProgressBar] = useState(true)
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
    if (!elementsState) return
    setProgressInApplication(startProgressState(templateSections))
    setLoadingProgressBar(false)
  }, [elementsState])

  const validateCurrentPage = (): boolean => {
    if (!application || !currentSection || !page) {
      console.log('Problem to validate - Undefined parameters')
      return false
    }

    const progressInPage = validateProgressInPage(
      elementsState as ApplicationElementStates,
      responsesByCode as ResponsesByCode,
      currentSection.index,
      Number(page)
    )
    setProgressInApplication(
      updateProgressInPage(
        progressInApplication as ProgressInApplication,
        currentSection.index,
        Number(page),
        progressInPage
      )
    )

    return application?.isLinear
      ? progressInPage.pageStatus
        ? progressInPage.pageStatus
        : false
      : true // Non-linear application
  }

  console.log('progressStructure', progressInApplication)

  return error || responsesError ? (
    <Message error header="Problem to load application" />
  ) : loading || responsesLoading ? (
    <Loading />
  ) : application &&
    templateSections &&
    serialNumber &&
    currentSection &&
    responsesByCode &&
    responsesFullByCode ? (
    <Segment.Group>
      <Grid stackable>
        <Grid.Column width={4}>
          {loadingProgressBar || !progressInApplication ? (
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
            applicationId={application.id}
            sectionTitle={currentSection.title}
            sectionTemplateId={currentSection.id}
            sectionPage={Number(page)}
            responsesByCode={responsesByCode}
            responsesFullByCode={responsesFullByCode}
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

const startProgressState = (templateSections: TemplateSectionPayload[]): ProgressInApplication => {
  return templateSections.reduce((progressInApplication: ProgressInApplication, section) => {
    const pages = Array.from(Array(section.totalPages).keys(), (n) => n + 1)
    const pagesProgress = pages.reduce((objPages, page) => {
      return {
        ...objPages,
        [page]: {
          visited: false,
        },
      }
    }, {})

    const progressInSection = {
      code: section.code,
      title: section.title,
      visited: false,
      pages: pagesProgress,
    }
    return [...progressInApplication, progressInSection]
  }, [])
}

const updateProgressInPage = (
  progressInApplication: ProgressInApplication,
  currentSection: number,
  currentPage: number,
  status: ProgressInPage
) => {
  let progressInSection: ProgressInSection = progressInApplication[currentSection]

  progressInSection = {
    ...progressInSection,
    pages: { ...progressInSection.pages, [currentPage]: status },
  }

  const allPagesValidated = Object.values(progressInApplication[currentSection].pages).every(
    (page) => page.pageStatus !== undefined
  )

  if (allPagesValidated) {
    progressInSection = {
      ...progressInSection,
      visited: true,
      sectionStatus: Object.values(progressInApplication[currentSection].pages).reduce(
        (accStatus: boolean, page) => {
          return accStatus && (page.pageStatus as boolean)
        },
        true
      ),
    }
  }

  progressInApplication[currentSection] = progressInSection

  return progressInApplication
}

const validateProgressInPage = (
  elementsState: ApplicationElementStates,
  responsesByCode: ResponsesByCode,
  currentSection: number,
  currentPage: number
): ProgressInPage => {
  let count = 1
  const pageElements = Object.entries(elementsState)
    .filter(([key, { section }]) => section === currentSection)
    .reduce((pageElements: { [index: string]: ElementState }, [key, element]) => {
      if (element.elementTypePluginCode === 'PageBreak') {
        count++
        return pageElements
      }

      if (count === currentPage && element.category === TemplateElementCategory.Question)
        pageElements[key] = element

      return pageElements
    }, {})

  const status = {
    visited: true,
    pageStatus: !Object.values(pageElements).some(
      (element) => element.isVisible && element.isRequired && !responsesByCode[element.code]
    ),
  }

  return status
}

export default ApplicationPageWrapper
