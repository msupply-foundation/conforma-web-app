import React, { useEffect } from 'react'
import {
  Application,
  ApplicationSection,
  TemplateElement,
  useGetApplicationQuery,
} from '../../utils/generated/graphql'
import { TemplateTypePayload } from '../../utils/types'
import { ApplicationStart, Loading } from '../../components'
import { useApplicationState } from '../../contexts/ApplicationState'
import { useRouter } from '../../utils/hooks/useRouter'
import { Container, Header, Label } from 'semantic-ui-react'
import useLoadTemplate from '../../utils/hooks/useLoadTemplate'
import useLoadApplication from '../../utils/hooks/useLoadApplication'

interface ApplicationCreateProps {
  type: string
  handleClick: (template: TemplateTypePayload) => void
}

type FlattenType = {
  templateId: number
  sectionCode: string
  sectionTitle: string
  elementCode: string
  pluginCode: string
}

const ApplicationCreate: React.FC<ApplicationCreateProps> = (props) => {
  const { applicationState, setApplicationState } = useApplicationState()
  const { type: templateCode, handleClick } = props
  const { push } = useRouter()
  const { serialNumber } = applicationState

  const { loading: templateIsLoading, templateType, templateSections } = useLoadTemplate({
    templateCode,
  })

  const { currentSection, loading } = useLoadApplication({ serialNumber: serialNumber as string })

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
