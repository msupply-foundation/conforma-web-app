import React, { useEffect, useState } from 'react'
import {
  Application,
  ApplicationSection,
  Template,
  TemplateElement,
  TemplateSection,
  useGetApplicationQuery,
  useGetTemplateQuery,
} from '../../utils/generated/graphql'
import { TemplatePayload, TemplateSectionPayload } from '../../utils/types'
import { ApplicationStart, Loading } from '../../components'
import { useApplicationState, Page } from '../../contexts/ApplicationState'
import { useRouter } from '../../utils/hooks/useRouter'
import { Container } from 'semantic-ui-react'

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
  const [ currentTemplate, setTemplate ] = useState<TemplatePayload | null>(null)
  const [ currentTemplateSections, setSections ] = useState<TemplateSectionPayload[]| null>(null)
  const { applicationState, setApplicationState } = useApplicationState()
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
      
      // Check the return application has sections
      if (!application.applicationSections || 
        application.applicationSections.nodes.length === 0)
        return // TODO: Should reset application here?
      
      const pages = Array<Page>()
      // Flatten section and elements
      const sections = application.applicationSections.nodes as ApplicationSection[]
      sections.forEach((section) => {
        const { templateSection } = section
        if (!templateSection) return
        const { id, code, templateElementsBySectionId, title} = templateSection
        // TODO: Remove elements not visible in the current stage...
        // TODO: concat all sections elements...
        const elements = templateElementsBySectionId.nodes as TemplateElement[]
        const result = elements.map((element: TemplateElement) => {
          const { code: elementCode, elementTypePluginCode: pluginCode } = element
          return { templateId: id, sectionCode: code as string, sectionTitle: title as string, elementCode, pluginCode: pluginCode as string }
        })

        // Add first and last element of page
        let page: Page = { templateId: id, sectionTitle: title as string, sectionCode: code as string }
        result.forEach((element: FlattenType) => {
          const { firstElement, lastElement } = page
          
          if (!firstElement) 
            page.firstElement = element.elementCode
          if (!lastElement && element.pluginCode === 'pagebreak') 
            page.lastElement = element.elementCode
          
          if (page.firstElement && page.lastElement) {
            pages.push(page)
            page = { templateId: id, sectionTitle: title as string, sectionCode: code as string }
          }
        })
        if (page.firstElement && !page.lastElement) {
          pages.push({ ...page, lastElement: null})
        }
      })
      setApplicationState({type: 'setPages', pages})
    }
  }, [data, error])

  useEffect(() => {
    const { pageNumber, pageIndex, pages, serialNumber } = applicationState
    if (serialNumber && pages) {
      
      if (pages === null || pageIndex === null) return 
      const sectionCode = pages[pageIndex].sectionCode

      // Show the application current step (current pageNumber)
      if (sectionCode)
        replace(`${serialNumber}/${sectionCode}/page${pageNumber}`)
      else
      replace(`${serialNumber}/summary`)
    }
  }, [applicationState])

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
