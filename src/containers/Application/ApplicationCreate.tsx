import React, { useEffect } from 'react'
import { TemplateTypePayload } from '../../utils/types'
import { ApplicationStart, Loading } from '../../components'
import { useApplicationState } from '../../contexts/ApplicationState'
import { useRouter } from '../../utils/hooks/useRouter'
import { Container, Header } from 'semantic-ui-react'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
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

  const { loading: templateIsLoading, templateType, templateSections } = useLoadTemplate({
    templateCode,
  })

  const { loading, currentSection } = useLoadApplication({ serialNumber: serialNumber as string })

  useEffect(() => {
    if (serialNumber && currentSection) {
      // Show the application current step (current pageNumber)
      // The pageNumber starts in 1 when is a new application.
      const pageNumber = 1
      push(`${serialNumber}/${currentSection}/page${pageNumber}`)
    }
  }, [serialNumber, currentSection])

  return templateIsLoading ? (
    <Loading />
  ) : templateType && templateSections ? (
    <Container>
      <ApplicationStart
        template={templateType}
        sections={templateSections}
        handleClick={() => handleClick(templateType)}
      />
      {loading ? <Loading /> : null}
    </Container>
  ) : (
    <Header as="h2" icon="exclamation circle" content="No template found!" />
  )
}

export default ApplicationCreate
