import React, { useEffect } from 'react'
import { TemplateTypePayload } from '../../utils/types'
import { ApplicationStart, Loading } from '../../components'
import { useApplicationState } from '../../contexts/ApplicationState'
import { useRouter } from '../../utils/hooks/useRouter'
import { Container, Header } from 'semantic-ui-react'
import useLoadTemplate from '../../utils/hooks/useLoadTemplate'

interface ApplicationCreateProps {
  type: string
  handleClick: (template: TemplateTypePayload) => void
}

const ApplicationCreate: React.FC<ApplicationCreateProps> = (props) => {
  const { applicationState } = useApplicationState()
  const { serialNumber } = applicationState
  const { type: templateCode, handleClick } = props
  const { push } = useRouter()

  const { apolloError, error, loading, templateType, templateSections } = useLoadTemplate({
    templateCode,
  })

  // const { loading, currentSection } = useLoadApplication({ serialNumber: serialNumber as string })

  useEffect(() => {
    if (serialNumber && templateSections && templateSections.length > 0) {
      // Call Application page on first section
      const firstSection = templateSections[0].code
      // The pageNumber starts in 1 when is a new application.
      const pageNumber = 1
      push(`${serialNumber}/${firstSection}/page${pageNumber}`)
    }
  }, [serialNumber, templateSections])

  return apolloError ? (
    <Header as="h2" icon="exclamation circle" content="Can't reach the server" />
  ) : error ? (
    <Header as="h2" icon="exclamation circle" content="No template found!" />
  ) : loading ? (
    <Loading />
  ) : templateType && templateSections ? (
    <Container>
      <ApplicationStart
        template={templateType}
        sections={templateSections}
        handleClick={() => handleClick(templateType)}
      />
    </Container>
  ) : (
    <Header as="h2" icon="exclamation circle" content="No template found!" />
  )
}

export default ApplicationCreate
