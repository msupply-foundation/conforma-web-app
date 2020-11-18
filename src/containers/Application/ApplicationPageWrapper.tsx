import React, { useEffect, useState } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import { Loading, ProgressBar } from '../../components'
import { Grid, Label, Message, Segment } from 'semantic-ui-react'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import useGetResponsesAndElementState from '../../utils/hooks/useGetResponsesAndElementState'
import { ElementsBox, NavigationBox } from './'
import {
  ApplicationElementStates,
  ProgressInApplication,
  TemplateSectionPayload,
} from '../../utils/types'

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
      setCurrentSection(templateSections.find(({ code }) => code === sectionCode))
    }
  }, [isApplicationLoaded])

  useEffect(() => {
    if (!elementsState) return
    setProgressInApplication(startProgressState(templateSections))
    setLoadingProgressBar(false)
  }, [elementsState])

  // const { processing, progressInSections } = useGetProgressInSections({
  //   application,
  //   currentSection,
  //   currentPage: Number(page),
  //   elementsState,
  //   templateSections,
  // })

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
          <NavigationBox templateSections={templateSections} />
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
  return templateSections.reduce((objSections, section) => {
    const pages = Array.from(Array(section.totalPages).keys(), (n) => n + 1)
    const pagesProgress = pages.reduce((objPages, page) => {
      return {
        ...objPages,
        [page]: {
          visited: false,
        },
      }
    }, {})
    return {
      ...objSections,
      [section.code]: {
        title: section.title,
        visited: false,
        pages: pagesProgress,
      },
    }
  }, {})
}

export default ApplicationPageWrapper
