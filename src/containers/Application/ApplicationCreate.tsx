import React, { useEffect, useState } from 'react'
import {
  Application,
  ApplicationSection,
  Template,
  TemplateSection,
  useGetApplicationQuery,
  useGetTemplateQuery,
} from '../../utils/generated/graphql'
import { TemplatePayload, TemplateSectionPayload } from '../../utils/types'
import ApplicationStart from '../../components/Application/ApplicationStart'
import Loading from '../../components/Loading'
import { useApplicationState } from '../../contexts/ApplicationState'
import { useRouter } from '../../utils/hooks/useRouter'
import { Container } from 'semantic-ui-react'
import { Login } from '../../components'

interface ApplicationCreateProps {
  type: string
  handleClick: (template: TemplatePayload) => void
}

const ApplicationCreate: React.FC<ApplicationCreateProps> = (props) => {
  const [ currentTemplate, setTemplate ] = useState<TemplatePayload | null>(null)
  const [ currentTemplateSections, setSections ] = useState<TemplateSectionPayload[]| null>(null)
  const { applicationState } = useApplicationState()
  const { type, handleClick } = props
  const { replace } = useRouter()

  const { data: templateData, loading: loadingTemplate, error: errorTemplate } = useGetTemplateQuery({ 
    variables: { 
      code: type 
    } 
  })

  const { data, loading, error} = useGetApplicationQuery({
    variables: {
      serial: applicationState.serialNumber as number
    }
  })

  useEffect(() => {
    if (templateData && templateData.templates && templateData.templates.nodes) {
      if (templateData.templates.nodes.length > 1)
        console.log('More than one template returned. Only one expected!')

      // Send the template to the local state
      const template = templateData.templates.nodes[0] as Template
      const { id, code, name } = template
      const templateName = name ? name : 'Undefined name'
      const templateType = { id, code, name: templateName, description: 'Include some description for this template', documents: Array<string>()}
      setTemplate(templateType)

      // Send the template sections to the local state
      if (template.templateSections && template.templateSections.nodes) {
        if (template.templateSections.nodes.length === 0)
          console.log('No Section on the template returned. At least one expected!')
        else {
          const sections = template.templateSections.nodes.map((section) => {
            const { id, code, title, templateElementsBySectionId} = section as TemplateSection
            const elementsCount = templateElementsBySectionId.nodes.length
            return { id, code: code as string, title: title as string, elementsCount }
          })
          setSections(sections)
        }
      }
    }
  }, [templateData, errorTemplate])

  useEffect(()=> {
    if (data && data.applications && data.applications.nodes.length>0) {
      if (data.applications.nodes.length > 1)
        console.log('More than one application returned. Only one expected!')
      const application = data.applications.nodes[0] as Application 
      
      // TODO: Store each section's start page on context and current!
      const pageNumber = 1
      const serialNumber = application.serial

      if (application.applicationSections && application.applicationSections.nodes.length > 0) {
        const firstSection = application.applicationSections.nodes[0] as ApplicationSection
        if (firstSection.templateSection) {
          const sectionCode = firstSection.templateSection.code
          
          // Show the application page (on 1st step)
          replace(`${serialNumber}/${sectionCode}/page${pageNumber}`)
        }
      }
    }
  }, [data, error])

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
      {loading ? <Loading/> : null}
      </Container>
    )
  )
}

export default ApplicationCreate
