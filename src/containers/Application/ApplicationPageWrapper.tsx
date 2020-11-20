import React, { useEffect, useState } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import { Loading, ProgressBar } from '../../components'
import { Grid, Label, Message, Progress, Segment } from 'semantic-ui-react'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import useGetResponsesAndElementState from '../../utils/hooks/useGetResponsesAndElementState'
import { ElementsBox, NavigationBox } from './'
import {
  ApplicationElementStates,
  ElementState,
  ProgressInApplication,
  ProgressInSection,
  ProgressStatus,
  ResponseFull,
  ResponsesFullByCode,
  ReviewCode,
  TemplateSectionPayload,
} from '../../utils/types'
import { TemplateElementCategory } from '../../utils/generated/graphql'

const progressStatus = {
  NOT_VALID: 'NOT_VALID',
  VALID: 'VALID',
  INCOMPLETE: 'INCOMPLETE',
}

const ApplicationPageWrapper: React.FC = () => {
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
  }, [elementsState, currentSection, page])

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

    return application?.isLinear ? validation === (progressStatus.VALID as ProgressStatus) : true
  }

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
          {processingValidation || !progressInApplication ? (
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

const getCombinedStatus = (array: { status: ProgressStatus }[] | undefined): ProgressStatus => {
  if (!array) return progressStatus.VALID as ProgressStatus
  return (array.every(({ status }) => status === (progressStatus.VALID as ProgressStatus))
    ? progressStatus.VALID
    : array.every(({ status }) => status === (progressStatus.NOT_VALID as ProgressStatus))
    ? progressStatus.NOT_VALID
    : progressStatus.INCOMPLETE) as ProgressStatus
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
      pages: pages.map((number) => ({
        pageName: `Page ${number}`,
        canNavigate: isLinear ? canNavigateToPage(section.index, number) : true,
        isActive: section.index === currentSection && number === currentPage,
        status: validatePage({
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

interface validatePageProps {
  elementsState: ApplicationElementStates
  responses: ResponsesFullByCode
  sectionIndex: number
  page: number
  checkEmpty?: boolean
}

function validatePage({
  elementsState,
  responses,
  sectionIndex,
  page,
  checkEmpty = false,
}: validatePageProps): ProgressStatus {
  let count = 1
  const elementsInCurrentPage = Object.values(elementsState)
    .filter(({ section }) => section === sectionIndex)
    .reduce((pageElements: ElementState[], element) => {
      if (element.elementTypePluginCode === 'PageBreak') count++
      if (count !== page) return pageElements
      if (element.category === TemplateElementCategory.Question) return [...pageElements, element]
      return pageElements
    }, [])

  const responsesStatuses = elementsInCurrentPage.reduce(
    (responsesStatuses: { status: ProgressStatus }[], element: ElementState) => {
      const { text, isValid } = responses[element.code] as ResponseFull
      const { isRequired, isVisible } = element

      console.log('Element code', element.code, 'text', text, 'size', text?.length)

      const findResponseIsExpected = (
        isVisible: boolean,
        isRequired: boolean,
        isFilled: string | null | undefined,
        checkEmpty: boolean
      ): boolean => {
        console.log(
          isVisible,
          isRequired,
          checkEmpty,
          isFilled,
          !isVisible
            ? false // Not visible
            : isRequired
            ? checkEmpty
              ? true // Visible, required & check for empty responses
              : !isFilled // Visible, required, not checking empty
            : isFilled
            ? true // Visible, not required but filled
            : false // Visible and not required
        )

        return !isVisible
          ? false // Not visible
          : checkEmpty
          ? isRequired
            ? true // Visible, required element
            : isFilled
            ? true // Visible, not required but filled
            : false // Visible and not required
          : !isFilled
          ? false // Unkown if required, Empty & not checking empty
          : isRequired
          ? true // Visible, required & check for empty responses
          : false // Visible, not required
      }

      const getResponseStatus = (
        expected: boolean,
        text: string | null | undefined,
        isValid: boolean | null | undefined
      ): ProgressStatus => {
        return (expected
          ? isValid
            ? progressStatus.VALID
            : !text || text.length === 0
            ? progressStatus.INCOMPLETE
            : progressStatus.NOT_VALID
          : progressStatus.INCOMPLETE) as ProgressStatus
      }

      const isRensponseExpected = findResponseIsExpected(isVisible, isRequired, text, checkEmpty)
      return [
        ...responsesStatuses,
        { status: getResponseStatus(isRensponseExpected, text, isValid) },
      ]
    },
    []
  )

  console.log(sectionIndex, page, 'responsesStatuses', responsesStatuses)

  return getCombinedStatus(responsesStatuses)
}

export default ApplicationPageWrapper
