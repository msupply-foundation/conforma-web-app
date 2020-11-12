import React, { useEffect } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import { Loading, ProgressBar } from '../../components'
import { Grid, Label, Message, Segment } from 'semantic-ui-react'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import useGetResponsesAndElementState from '../../utils/hooks/useGetResponsesAndElementState'
import { ElementsBox, NavigationBox } from './'

const ApplicationPageWrapper: React.FC = () => {
  const { query, push, replace } = useRouter()
  const { mode, serialNumber, sectionCode, page } = query

  const { error, loading, application, templateSections, appStatus, isReady } = useLoadApplication({
    serialNumber: serialNumber as string,
  })

  // console.log('error', error)
  // console.log('loading', loading)

  const {
    error: responsesError,
    loading: responsesLoading,
    responsesByCode,
    responsesFullByCode,
    elementsState,
  } = useGetResponsesAndElementState({
    serialNumber: serialNumber as string,
    isReady,
  })

  // console.log('appStatus', appStatus)
  // console.log('responsesError', responsesError)
  // console.log('responsesLoading', responsesLoading)
  // console.log('responsesByCode', responsesByCode)
  // console.log('elementsState', elementsState)

  useEffect(() => {
    if (application) {
      processRedirect({
        ...appStatus,
        serialNumber,
        sectionCode,
        page,
        templateSections,
        push,
        replace,
      })
    }
  }, [application])

  const currentSection = templateSections.find(({ code }) => code == sectionCode)

  return error ? (
    <Message error header="Problem to load application" />
  ) : loading || responsesLoading ? (
    <Loading />
  ) : application &&
    templateSections &&
    serialNumber &&
    currentSection &&
    Object.keys(elementsState).length !== 0 ? (
    <Segment.Group>
      <Grid stackable>
        <Grid.Column width={4}>
          <ProgressBar
            serialNumber={serialNumber}
            currentSectionPage={{ sectionIndex: currentSection.index, currentPage: Number(page) }}
            templateSections={templateSections}
            push={push}
          />
        </Grid.Column>
        <Grid.Column width={12} stretched>
          <ElementsBox
            applicationId={application.id}
            sectionTitle={currentSection.title}
            sectionTemplateId={currentSection.id}
            sectionPage={Number(page)}
            responsesByCode={responsesByCode}
            responsesFullByCode={responsesFullByCode}
            elementsState={elementsState}
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

export default ApplicationPageWrapper
