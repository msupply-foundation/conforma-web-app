import React, { useEffect, useState } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import { Loading, ProgressBar, ModalWarning, NoMatch } from '../../components'
import {
  Button,
  ButtonProps,
  Grid,
  Header,
  Label,
  Message,
  ModalProps,
  Segment,
  Sticky,
} from 'semantic-ui-react'
import { useUpdateResponseMutation } from '../../utils/generated/graphql'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import useGetResponsesAndElementState from '../../utils/hooks/useGetResponsesAndElementState'
import { useApplicationState } from '../../contexts/ApplicationState'
import { useUserState } from '../../contexts/UserState'
import { ElementsBox, NavigationBox } from './'
import validatePage, {
  getCombinedStatus,
  getPageElementsStatuses,
  PROGRESS_STATUS,
} from '../../utils/helpers/application/validatePage'
import getPageElements from '../../utils/helpers/application/getPageElements'
import { revalidateAll, getFirstErrorLocation } from '../../utils/helpers/application/revalidateAll'
import strings from '../../utils/constants'
import messages from '../../utils/messages'
import {
  ApplicationElementStates,
  ApplicationStage,
  ElementState,
  ProgressInApplication,
  ProgressInSection,
  ProgressStatus,
  ResponsesByCode,
  TemplateSectionPayload,
  User,
  ValidationMode,
} from '../../utils/types'
import { TemplateElementCategory } from '../../utils/generated/graphql'
import getPreviousPage from '../../utils/helpers/application/getPreviousPage'

const ApplicationPageWrapper: React.FC = () => {
  const {
    applicationState: {
      inputElementsActivity: { areTimestampsInSequence },
    },
    setApplicationState,
  } = useApplicationState()
  const [summaryButtonClicked, setSummaryButtonClicked] = useState(false)
  const [currentSection, setCurrentSection] = useState<TemplateSectionPayload>()
  const [pageElements, setPageElements] = useState<ElementState[]>([])
  const [progressInApplication, setProgressInApplication] = useState<ProgressInApplication>()
  const [forceValidation, setForceValidation] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<ModalProps>({ open: false })
  const {
    userState: { currentUser },
  } = useUserState()
  const { query, push, replace } = useRouter()
  const { mode, serialNumber, sectionCode, page } = query

  const { error, loading, application, templateSections, isApplicationLoaded } = useLoadApplication(
    {
      serialNumber: serialNumber as string,
      // networkFetch: true,
    }
  )

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
    if (elementsState && responsesByCode && isApplicationLoaded) {
      const stage = application?.stage as ApplicationStage
      processRedirect({
        ...stage,
        serialNumber,
        sectionCode,
        page,
        templateSections,
        push,
        replace,
        elementsState,
        responsesByCode,
        currentUser,
      })

      if (sectionCode && page)
        setCurrentSection(templateSections.find(({ code }) => code === sectionCode))
    }
  }, [elementsState, responsesByCode, sectionCode, page, isApplicationLoaded])

  // Update timestamp to keep track of when elements have been properly updated
  // after losing focus.
  useEffect(() => {
    setApplicationState({
      type: 'setElementTimestamp',
      timestampType: 'elementsStateUpdatedTimestamp',
    })
  }, [elementsState])

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

  const defaultCurrentPage = {
    section: currentSection as TemplateSectionPayload,
    page: Number(page),
  }

  const validateElementsInPage = ({ section, page } = defaultCurrentPage): boolean => {
    const pageElementsStatuses = getPageElementsStatuses({
      elementsState: elementsState as ApplicationElementStates,
      responses: responsesByCode as ResponsesByCode,
      currentSectionIndex: section.index,
      page,
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

  // Make sure all responses are up-to-date (areTimestampsInSequence)
  // and only proceed when button is clicked AND responses are ready
  useEffect(() => {
    if (areTimestampsInSequence && summaryButtonClicked) {
      handleSummaryClick()
    }
  }, [areTimestampsInSequence, summaryButtonClicked])

  const openModal = () => {
    setShowModal({
      open: true,
      ...messages.VALIDATION_FAIL,
      onClick: (event: any, data: ButtonProps) => setShowModal({ open: false }),
      onClose: () => setShowModal({ open: false }),
    })
  }

  const handleSummaryClick = async () => {
    setSummaryButtonClicked(false)
    const revalidate = await revalidateAll(
      elementsState as ApplicationElementStates,
      responsesByCode as ResponsesByCode,
      currentUser as User
    )

    // Update database if validity changed
    revalidate.validityFailures.forEach((changedElement) => {
      responseMutation({
        variables: {
          id: changedElement.id,
          isValid: changedElement.isValid,
        },
      })
    })

    if (!revalidate.allValid) openModal()
    else push(`/application/${serialNumber}/summary`)
  }

  return error || responsesError ? (
    <NoMatch />
  ) : loading || responsesLoading ? (
    <Loading />
  ) : application && templateSections && serialNumber && currentSection && responsesByCode ? (
    <Segment.Group style={{ backgroundColor: 'Gainsboro', display: 'flex' }}>
      <ModalWarning showModal={showModal} />
      <Header textAlign="center">
        {currentUser?.organisation?.orgName || strings.TITLE_NO_ORGANISATION}
      </Header>
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
              getPreviousPage={(props) => getPreviousPage({ templateSections, ...props })}
              validateElementsInPage={validateElementsInPage}
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
              validateElementsInPage={validateElementsInPage}
              openModal={openModal}
            />
          </Segment>
        </Grid.Column>
        <Grid.Column width={2} />
      </Grid>
      <Sticky
        pushing
        style={{ backgroundColor: 'white', boxShadow: ' 0px -5px 8px 0px rgba(0,0,0,0.1)' }}
      >
        <Segment basic textAlign="right">
          <Button color="blue" onClick={() => setSummaryButtonClicked(true)}>
            {strings.BUTTON_SUMMARY}
          </Button>
        </Segment>
      </Sticky>
    </Segment.Group>
  ) : (
    <Label content={strings.ERROR_APPLICATION_SECTION} />
  )
}

const getPageHasRequiredQuestions = (elements: ElementState[]): boolean =>
  elements.some(
    ({ isRequired, isVisible, category }) =>
      category === TemplateElementCategory.Question && isRequired && isVisible
  )

async function processRedirect(appState: any) {
  // All logic for re-directing/configuring page based on application state, permissions, roles, etc. should go here.
  const {
    stage,
    status,
    serialNumber,
    sectionCode,
    page,
    templateSections,
    push,
    replace,
    elementsState,
    responsesByCode,
    currentUser,
  } = appState
  if (status !== 'DRAFT') {
    replace(`/application/${serialNumber}/summary`)
    return
  }
  if (!sectionCode || !page) {
    const revalidate = await revalidateAll(elementsState, responsesByCode, currentUser as User)

    if (revalidate.validityFailures.length > 0) {
      const { firstErrorSectionCode, firstErrorPage } = getFirstErrorLocation(
        revalidate.validityFailures,
        elementsState as ApplicationElementStates
      )
      push(`/application/${serialNumber}/${firstErrorSectionCode}/Page${firstErrorPage}`)
    } else {
      const firstSection = templateSections[0].code
      replace(`/application/${serialNumber}/${firstSection}/Page1`)
    }
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
    if (pageNumber === 1 && sectionIndex === 0) return true // First page in first section can be navigated always
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
      canNavigate: !isLinear || section.index <= currentSection || isPreviousSectionValid,
      isActive: section.index === currentSection,

      // Run each page using strict validation mode for linear application with visited pages
      pages: pageNumbers.map((pageNumber) => {
        const pageValidationMode =
          validationMode || getPageValidationMode(pageNumber, section.index)

        const status = getPageStatus(section.index, pageNumber, pageValidationMode)
        previousPageStatus = status // Update new previous page for next iteration

        return {
          pageNumber,
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
