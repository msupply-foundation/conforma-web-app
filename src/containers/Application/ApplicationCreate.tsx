import React, { useEffect } from 'react'
import { TemplateTypePayload } from '../../utils/types'
import { ApplicationStart, Loading } from '../../components'
import { useApplicationState } from '../../contexts/ApplicationState'
import { useRouter } from '../../utils/hooks/useRouter'
import { Header } from 'semantic-ui-react'
import useLoadTemplate from '../../utils/hooks/useLoadTemplate'
import useCreateApplication from '../../utils/hooks/useCreateApplication'

const ApplicationCreate: React.FC = (props) => {
  const { applicationState, setApplicationState } = useApplicationState()
  const { serialNumber } = applicationState
  const { push, query } = useRouter()
  const { type } = query

  const { applicationMutation, responses } = useCreateApplication()

  const { apolloError, error, loading, templateType, templateSections } = useLoadTemplate({
    templateCode: type as string,
  })

  useEffect(() => {
    if (
      Object.values(responses).length > 0 && // Checking the responses are created
      !Object.values(responses).some((value) => value === false) &&
      serialNumber &&
      templateSections &&
      templateSections.length > 0
    ) {
      // Call Application page on first section
      const firstSection = templateSections[0].code
      // The pageNumber starts in 1 when is a new application.
      const pageNumber = 1
      push(`${serialNumber}/${firstSection}/page${pageNumber}`)
    }
  }, [serialNumber, responses, templateSections])

  return apolloError ? (
    <Header as="h2" icon="exclamation circle" content="Can't reach the server" />
  ) : error ? (
    <Header as="h2" icon="exclamation circle" content="No template found!" />
  ) : loading ? (
    <Loading />
  ) : templateType && templateSections ? (
    <ApplicationStart
      template={templateType}
      sections={templateSections}
      handleClick={() => {
        setApplicationState({ type: 'reset' })
        handleCreateApplication(applicationMutation, setApplicationState, templateType)
      }}
    />
  ) : (
    <Header as="h2" icon="exclamation circle" content="No template found!" />
  )
}

function handleCreateApplication(
  applicationMutation: any,
  setApplicationState: any,
  template: TemplateTypePayload
) {
  // TODO: New issue to generate serial - should be done in server?
  const serialNumber = Math.round(Math.random() * 10000).toString()
  setApplicationState({ type: 'setSerialNumber', serialNumber })
  try {
    applicationMutation({
      variables: {
        name: `Test application of ${template.name}`,
        serial: serialNumber,
        templateId: template.id,
      },
    })
  } catch (error) {
    console.error(error)
  }
}

export default ApplicationCreate
