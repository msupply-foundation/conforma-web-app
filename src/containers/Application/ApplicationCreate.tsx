import React, { useEffect } from 'react'
import { ApplicationStart, Loading } from '../../components'
import { useApplicationState } from '../../contexts/ApplicationState'
import { useRouter } from '../../utils/hooks/useRouter'
import { Header, Message } from 'semantic-ui-react'
import useLoadTemplate from '../../utils/hooks/useLoadTemplate'
import useCreateApplication from '../../utils/hooks/useCreateApplication'
import { useUserState } from '../../contexts/UserState'
import strings from '../../utils/constants'

const ApplicationCreate: React.FC = () => {
  const { applicationState, setApplicationState } = useApplicationState()
  const { serialNumber } = applicationState
  const { push, query } = useRouter()
  const { type } = query

  const { apolloError, error, loading, template, sections, elementsIds } = useLoadTemplate({
    templateCode: type as string,
  })

  const {
    userState: { currentUser },
  } = useUserState()

  // If template has no start message, go straight to first page of new application
  useEffect(() => {
    if (template && !template.startMessage) handleCreate()
  }, [template])

  const { processing, error: creationError, create } = useCreateApplication({
    onCompleted: () => {
      if (serialNumber && sections && sections.length > 0) {
        // Call Application page on first section
        const firstSection = sections[0].code
        // The pageNumber starts in 1 when is a new application
        push(`${serialNumber}/${firstSection}/Page1`)
      }
    },
  })

  const handleCreate = () => {
    setApplicationState({ type: 'reset' })

    if (!template || !sections) {
      console.log('Problem to create application - unexpected parameters')
      return
    }
    // TODO: New issue to generate serial - should be done in server?
    const serialNumber = Math.round(Math.random() * 10000).toString()
    setApplicationState({ type: 'setSerialNumber', serialNumber })

    create({
      name: `Test application of ${template.name}`,
      serial: serialNumber,
      templateId: template.id,
      userId: currentUser?.userId,
      orgId: currentUser?.organisation?.orgId,
      templateSections: sections.map((section) => {
        return { templateSectionId: section.id }
      }),
      templateResponses: elementsIds.map((id) => {
        return { templateElementId: id }
      }),
    })
  }

  return error || apolloError || creationError ? (
    <Message
      error
      header={strings.ERROR_APPLICATION_CREATE}
      list={[error, apolloError?.message, creationError?.message]}
    />
  ) : loading || processing ? (
    <Loading />
  ) : template && sections ? (
    <ApplicationStart template={template} sections={sections} handleClick={() => handleCreate()} />
  ) : (
    <Header as="h2" icon="exclamation circle" content="No template found!" />
  )
}

export default ApplicationCreate
