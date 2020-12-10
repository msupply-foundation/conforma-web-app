import React, { useEffect, useState } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import { Loading, ProgressBar } from '../../components'
import { Button, Grid, Header, Label, Message, Segment, Sticky } from 'semantic-ui-react'
import { useUpdateResponseMutation } from '../../utils/generated/graphql'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import useGetResponsesAndElementState from '../../utils/hooks/useGetResponsesAndElementState'
import { ElementsBox, NavigationBox } from './'
import validatePage, {
  getCombinedStatus,
  getPageElementsStatuses,
  PROGRESS_STATUS,
} from '../../utils/helpers/validatePage'
import getPageElements from '../../utils/helpers/getPageElements'
import { revalidateAll } from '../../utils/helpers/revalidateAll'
import strings from '../../utils/constants'

import {
  ApplicationElementStates,
  ElementState,
  ProgressInApplication,
  ProgressInSection,
  ProgressStatus,
  ResponsesByCode,
  TemplateSectionPayload,
  ValidationMode,
} from '../../utils/types'
import { TemplateElementCategory } from '../../utils/generated/graphql'

const ApplicationPageWrapper: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<TemplateSectionPayload>()
  const [pageElements, setPageElements] = useState<ElementState[]>([])
  const [progressInApplication, setProgressInApplication] = useState<ProgressInApplication>()
  const [forceValidation, setForceValidation] = useState<boolean>(false)
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

  const [responseMutation] = useUpdateResponseMutation()

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
    if (responsesLoading || !elementsState || !currentSection) return

    const progressStructure = buildProgressInApplication({
      elementsState,
      responses: responsesByCode,
      templateSections,
      isLinear: application?.isLinear as boolean,
      currentSection: currentSection.index,
      currentPage: Number(page),
    })
    setProgressInApplication(progressStructure)

    const elements = getPageElements({
      elementsState,
      sectionIndex: currentSection.index,
      pageNumber: Number(page),
    })

    setPageElements(elements)
  }, [responsesLoading, currentSection, page, elementsState])

  const validateCurrentPage = (): boolean => {
    if (!application || !currentSection || !page) {
      console.log('Problem to validate - Undefined parameters')
      return false
    }

    const pageElementsStatuses = getPageElementsStatuses({
      elementsState: elementsState as ApplicationElementStates,
      responses: responsesByCode as ResponsesByCode,
      currentSectionIndex: currentSection?.index as number,
      page: Number(page),
    })

    if (application?.isLinear && responsesByCode) {
      Object.entries(pageElementsStatuses).forEach(([code, status]) => {
        if (status === PROGRESS_STATUS.INCOMPLETE) {
          // Update responses text to re-validate the status (on the page)
          const response = responsesByCode[code]
          if (response) {
            setForceValidation(true)
            responseMutation({
              variables: {
                id: response.id,
                value: { text: '' },
                isValid: false,
              },
            })
          }
        }
      })
    }

    const statuses = Object.values(pageElementsStatuses)
    const validation = getCombinedStatus(statuses)

    // Run STRICT validation for linear and LOOSE for non-linear application
    return application?.isLinear ? validation === (PROGRESS_STATUS.VALID as ProgressStatus) : true
  }

  return error || responsesError ? (
    <Message error header="Problem to load application" />
  ) : loading || responsesLoading ? (
    <Loading />
  ) : application && templateSections && serialNumber && currentSection && responsesByCode ? (
    <Segment.Group style={{ backgroundColor: 'Gainsboro', display: 'flex' }}>
      <Header textAlign="center">{strings.TITLE_COMPANY_PLACEHOLDER}</Header>
      <Grid
        stackable
        style={{
          backgroundColor: 'white',
          padding: 10,
          margin: '0px 50px',
          minHeight: 500,
          flex: 1,
        }}
      >
        <Grid.Column width={4}>
          {!progressInApplication ? (
            <Loading />
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
        <Grid.Column width={10} stretched>
          <Segment basic>
            <ElementsBox
              sectionTitle={currentSection.title}
              responsesByCode={responsesByCode}
              elements={pageElements}
              anyRequiredQuestions={getPageHasRequiredQuestions(pageElements)}
              forceValidation={forceValidation}
            />
            <NavigationBox
              templateSections={templateSections}
              currentSection={currentSection}
              serialNumber={serialNumber}
              currentPage={Number(page as string)}
              validateCurrentPage={validateCurrentPage}
            />
          </Segment>
        </Grid.Column>
        <Grid.Column width={2} />
      </Grid>
      <Sticky pushing style={{ backgroundColor: 'white' }}>
        <Segment basic textAlign="right">
          <Button color="blue" onClick={() => push(`/applications/${serialNumber}/summary`)}>
            {strings.BUTTON_SUBMIT}
          </Button>
        </Segment>
      </Sticky>
    </Segment.Group>
  ) : (
    <Label content="Application's section can't be displayed" />
  )
}

const getPageHasRequiredQuestions = (elements: ElementState[]): boolean =>
  elements.some(
    ({ isRequired, isVisible, category }) =>
      category === TemplateElementCategory.Question && isRequired && isVisible
  )

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
    replace(`/application/${serialNumber}/summary`)
    return
  }
  if (!sectionCode || !page) {
    const firstSection = templateSections[0].code
    replace(`/application/${serialNumber}/${firstSection}/page1`)
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
  let previousPageStatus: ProgressStatus = PROGRESS_STATUS.VALID

  const isCurrentPage = (page: number, sectionIndex: number) =>
    sectionIndex === currentSection && page === currentPage
  const isCurrentSection = (sectionIndex: number) => sectionIndex === currentSection

  const isPreviousPageValid = (pageNumber: number, sectionIndex: number): boolean => {
    const previousPage = pageNumber - 1
    const isPreviousActive =
      previousPage > 0
        ? isCurrentPage(previousPage, sectionIndex)
        : isCurrentSection(sectionIndex - 1)
    return isPreviousActive ? false : previousPageStatus === PROGRESS_STATUS.VALID
  }

  const getPageStatus = (sectionIndex: number, page: number, validationMode: ValidationMode) => {
    const draftPageStatus = validatePage({
      elementsState,
      responses,
      currentSectionIndex: sectionIndex,
      page,
    })
    if (validationMode === 'STRICT')
      return draftPageStatus === PROGRESS_STATUS.VALID
        ? PROGRESS_STATUS.VALID
        : PROGRESS_STATUS.NOT_VALID
    return draftPageStatus
  }

  const getPageValidationMode = (pageNumber: number, sectionIndex: number) =>
    isLinear && isPreviousPageValid(pageNumber, sectionIndex) ? 'STRICT' : 'LOOSE'

  return templateSections.map((section) => {
    // Create an array with all pages in each section
    const pageNumbers = Array.from(Array(section.totalPages).keys(), (n) => n + 1)

    const isPreviousSectionValid = previousSectionStatus === PROGRESS_STATUS.VALID
    previousPageStatus = previousSectionStatus

    const progressInSection: ProgressInSection = {
      code: section.code,
      title: section.title,
      canNavigate: isLinear && (section.index <= currentSection || isPreviousSectionValid),
      isActive: section.index === currentSection,

      // Run each page using strict validation mode for linear application with visited pages
      pages: pageNumbers.map((pageNumber) => {
        const pageValidationMode =
          validationMode || getPageValidationMode(pageNumber, section.index)

        const status = getPageStatus(section.index, pageNumber, pageValidationMode)
        previousPageStatus = status // Update new previous page for next iteration

        return {
          pageName: `Page ${pageNumber}`,
          canNavigate: isLinear ? isPreviousPageValid(pageNumber, section.index) : true,
          isActive: isCurrentPage(pageNumber, section.index),
          status,
        }
      }),
    }
    progressInSection.status = getCombinedStatus(
      progressInSection.pages.map(({ status }) => status)
    )
    previousSectionStatus = progressInSection.status

    return progressInSection
  })
}

export default ApplicationPageWrapper
