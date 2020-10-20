import React, { useEffect, useState } from 'react'
import { Template, TemplateSection, useGetTemplateQuery } from '../../utils/generated/graphql'
import { TemplatePayload, TemplateSectionPayload } from '../../utils/types'
import { ApplicationStart, Loading } from '../../components'
import { useApplicationState } from '../../contexts/ApplicationState'
import { useRouter } from '../../utils/hooks/useRouter'
import { Container } from 'semantic-ui-react'
import useLoadApplication from '../../utils/hooks/useLoadApplication'

interface ApplicationCreateProps {
  type: string
  handleClick: (template: TemplatePayload) => void
}

type FlattenType = {
  templateId: number
  sectionCode: string
  sectionTitle: string
  elementCode: string
  pluginCode: string
}

const ApplicationCreate: React.FC<ApplicationCreateProps> = (props) => {
  const [currentTemplate, setTemplate] = useState<TemplatePayload | null>(null)
  const [currentTemplateSections, setSections] = useState<TemplateSectionPayload[] | null>(null)
  const { applicationState } = useApplicationState()
  const { serialNumber } = applicationState
  const { type, handleClick } = props
  const { push } = useRouter()

  const {
    data: templateData,
    loading: loadingTemplate,
    error: errorTemplate,
  } = useGetTemplateQuery({
    variables: {
      code: type,
    },
  })

  const application = useLoadApplication({ serialNumber: serialNumber as string })
  const { currentSection } = application

  useEffect(() => {
    if (templateData && templateData.templates && templateData.templates.nodes) {
      if (templateData.templates.nodes.length > 1)
        console.log('More than one template returned. Only one expected!')

      // Send the template to the local state
      const template = templateData.templates.nodes[0] as Template
      const { id, code, name } = template
      const templateName = name ? name : 'Undefined name'
      const templateType = {
        id,
        code,
        name: templateName,
        description: 'Include some description for this template',
        documents: Array<string>(),
      }
      setTemplate(templateType)

      // Send the template sections to the local state
      if (template.templateSections && template.templateSections.nodes) {
        if (template.templateSections.nodes.length === 0)
          console.log('No Section on the template returned. At least one expected!')
        else {
          const sections = template.templateSections.nodes.map((section) => {
            const { id, code, title, templateElementsBySectionId } = section as TemplateSection
            const elementsCount = templateElementsBySectionId.nodes.length
            return { id, code: code as string, title: title as string, elementsCount }
          })
          setSections(sections)
        }
      }
    }
  }, [templateData, errorTemplate])

  useEffect(() => {
    if (serialNumber && currentSection) {
      // Show the application current step (current pageNumber)
      // The pageNumber starts in 1 when is a new application.
      const pageNumber = 1
      push(`${serialNumber}/${currentSection}/page${pageNumber}`)
    }
  }, [serialNumber, currentSection])

  return loadingTemplate ? (
    <Loading />
  ) : (
    currentTemplate && currentTemplateSections && (
      <Container>
        <ApplicationStart
          template={currentTemplate}
          sections={currentTemplateSections}
          handleClick={() => handleClick(currentTemplate)}
        />
        {application.loading ? <Loading /> : null}
      </Container>
    )
  )
}

export default ApplicationCreate
