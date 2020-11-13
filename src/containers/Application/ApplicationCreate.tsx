import React, { useEffect } from 'react'
import { TemplateTypePayload } from '../../utils/types'
import { ApplicationStart, Loading } from '../../components'
import { useApplicationState } from '../../contexts/ApplicationState'
import { useRouter } from '../../utils/hooks/useRouter'
import { Header, Message } from 'semantic-ui-react'
import useLoadTemplate from '../../utils/hooks/useLoadTemplate'
import useCreateApplication, {
  createApplicationProps,
} from '../../utils/hooks/useCreateApplication'

const ApplicationCreate: React.FC = () => {
  const { applicationState, setApplicationState } = useApplicationState()
  const { serialNumber } = applicationState
  const { push, query } = useRouter()
  const { type } = query

  const { processing, error: creationError, create } = useCreateApplication()

  const {
    apolloError,
    error,
    loading,
    templateType,
    templateSections,
    templateElementsIds,
  } = useLoadTemplate({
    templateCode: type as string,
  })

  useEffect(() => {
    if (!processing && serialNumber && templateSections && templateSections.length > 0) {
      // Call Application page on first section
      const firstSection = templateSections[0].code
      // The pageNumber starts in 1 when is a new application.
      const pageNumber = 1
      push(`${serialNumber}/${firstSection}/page${pageNumber}`)
    }
  }, [serialNumber, templateSections, processing])

  return error || apolloError || creationError ? (
    <Message
      error
      header="Problem to load application creation page"
      list={[error, apolloError?.message, creationError?.message]}
    />
  ) : loading ? (
    <Loading />
  ) : templateType && templateSections ? (
    <ApplicationStart
      template={templateType}
      sections={templateSections}
      handleClick={() => {
        setApplicationState({ type: 'reset' })
        handleCreate({
          create,
          setApplicationState,
          templateName: templateType.name,
          templateId: templateType.id,
          templateSections: templateSections.map((section) => {
            return { templateSectionId: section.id }
          }),
          templateResponses: templateElementsIds.map((id) => {
            return { templateElementId: id }
          }),
        })
      }}
    />
  ) : (
    <Header as="h2" icon="exclamation circle" content="No template found!" />
  )
}

interface handleCreateProps {
  create: (props: createApplicationProps) => void
  setApplicationState: any
  templateName: string
  templateId: number
  templateSections: { templateSectionId: number }[]
  templateResponses: { templateElementId: number }[]
}

function handleCreate({
  create,
  setApplicationState,
  templateName,
  templateId,
  templateSections,
  templateResponses,
}: handleCreateProps) {
  // TODO: New issue to generate serial - should be done in server?
  const serialNumber = Math.round(Math.random() * 10000).toString()
  setApplicationState({ type: 'setSerialNumber', serialNumber })

  create({
    name: `Test application of ${templateName}`,
    serial: serialNumber,
    templateId,
    templateSections,
    templateResponses,
  })
}

export default ApplicationCreate
