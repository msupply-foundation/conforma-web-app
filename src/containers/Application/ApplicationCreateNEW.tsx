import React, { useEffect, useState } from 'react'
import { Button, Divider, Header, Message, Segment } from 'semantic-ui-react'
import evaluate from '@openmsupply/expression-evaluator'
import Markdown from '../../utils/helpers/semanticReactMarkdown'
import { ApplicationHeader, Loading } from '../../components'
import { useApplicationState } from '../../contexts/ApplicationState'
import { useUserState } from '../../contexts/UserState'
import useCreateApplication from '../../utils/hooks/useCreateApplication'
import useLoadTemplate from '../../utils/hooks/useLoadTemplateNEW'
import { useRouter } from '../../utils/hooks/useRouter'
import strings from '../../utils/constants'
import { EvaluatorParameters } from '../../utils/types'
import SectionsList from '../../components/Sections/SectionsList'

const ApplicationCreateNEW: React.FC = () => {
  const {
    applicationState: { serialNumber },
    setApplicationState,
  } = useApplicationState()
  const {
    push,
    query: { type },
  } = useRouter()
  const [startMessageEvaluated, setStartMessageEvaluated] = useState('')

  const { error, loading, template, sections, elementsIds } = useLoadTemplate({
    templateCode: type as string,
  })

  const {
    userState: { currentUser },
  } = useUserState()

  // If template has no start message, go straight to first page of new application
  useEffect(() => {
    if (template && !template.startMessage) handleCreate()
    else evaluateMessage()
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

  const evaluateMessage = async () => {
    const evaluatorParams: EvaluatorParameters = {
      objects: { currentUser },
      APIfetch: fetch,
    }
    evaluate(template?.startMessage || '', evaluatorParams).then((result: any) =>
      setStartMessageEvaluated(result)
    )
  }

  const handleCreate = (_?: any) => {
    setApplicationState({ type: 'reset' })

    if (!template || !sections) {
      console.log('Problem to create application - unexpected parameters')
      return
    }
    // TODO: New issue to generate serial - should be done in server?
    const serialNumber = Math.round(Math.random() * 10000).toString()
    setApplicationState({ type: 'setSerialNumber', serialNumber })

    create({
      name: template.name,
      serial: serialNumber,
      templateId: template.id,
      userId: currentUser?.userId,
      orgId: currentUser?.organisation?.orgId,
      templateSections: sections.map(({ id }) => {
        return { templateSectionId: id }
      }),
      templateResponses: elementsIds.map((id) => {
        return { templateElementId: id }
      }),
    })
  }

  if (!template || !sections) return <Loading />

  const CreateComponent: React.FC = () => {
    return (
      <Segment basic>
        <Header as="h5">{strings.SUBTITLE_APPLICATION_STEPS}</Header>
        <Header as="h5">{strings.TITLE_STEPS.toUpperCase()}</Header>
        <SectionsList sections={sections} />
        <Divider />
        <Markdown text={startMessageEvaluated} semanticComponent="Message" info />
        <Button color="blue" loading={processing} onClick={handleCreate}>
          {strings.BUTTON_APPLICATION_START}
        </Button>
      </Segment>
    )
  }

  return error ? (
    <Message
      error
      title={strings.ERROR_APPLICATION_CREATE}
      list={[error, creationError?.message]}
    />
  ) : (
    <ApplicationHeader
      template={template}
      currentUser={currentUser}
      ChildComponent={CreateComponent}
    />
  )
}

export default ApplicationCreateNEW
