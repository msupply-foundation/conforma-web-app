import React, { useEffect } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import { Loading } from '../../components'
import { Label, Message } from 'semantic-ui-react'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import useGetResponsesAndElementState from '../../utils/hooks/useGetResponsesAndElementState'
import ApplicationSectionWrapper from './ApplicationSectionWrapper'

const ApplicationPageWrapper: React.FC = () => {
  const { query, push, replace } = useRouter()
  const { mode, serialNumber, sectionCode, page } = query

  const { error, loading, application, templateSections, appStatus, isReady } = useLoadApplication({
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
    isReady,
  })

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

  return error ? (
    <Message error header="Problem to load application" />
  ) : loading || responsesLoading ? (
    <Loading />
  ) : application && templateSections && serialNumber && Object.keys(elementsState).length !== 0 ? (
    <ApplicationSectionWrapper
      applicationId={application.id}
      templateSections={templateSections}
      responsesByCode={responsesByCode}
      responsesFullByCode={responsesFullByCode}
      elementsState={elementsState}
    />
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
