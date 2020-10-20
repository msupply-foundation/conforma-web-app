import React, { useEffect } from 'react'
import {
  Application,
  ApplicationSection,
  TemplateElement,
  useGetApplicationQuery,
} from '../../utils/generated/graphql'
import { TemplateTypePayload } from '../../utils/types'
import { ApplicationStart, Loading } from '../../components'
import { useApplicationState, Page } from '../../contexts/ApplicationState'
import { useRouter } from '../../utils/hooks/useRouter'
import { Container, Header, Label } from 'semantic-ui-react'
import useLoadTemplate from '../../utils/hooks/useLoadTemplate'

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
  const { type, handleClick } = props
  const { replace } = useRouter()

  const { loading: templateIsLoading, templateType, templateSections } = useLoadTemplate({ type })

  const { data, loading, error } = useGetApplicationQuery({
    variables: {
      serial: applicationState.serialNumber as string,
    },
  })

  useEffect(() => {
    if (data && data.applications && data.applications.nodes.length > 0) {
      if (data.applications.nodes.length > 1)
        console.log('More than one application returned. Only one expected!')
      const application = data.applications.nodes[0] as Application

      // Check the return application has sections
      if (!application.applicationSections || application.applicationSections.nodes.length === 0)
        return // TODO: Should reset application here?

      const pages = Array<Page>()
      // Flatten section and elements
      const sections = application.applicationSections.nodes as ApplicationSection[]
      sections.forEach((section) => {
        const { templateSection } = section
        if (!templateSection) return
        const { id, code, templateElementsBySectionId, title } = templateSection
        // TODO: Remove elements not visible in the current stage...
        // TODO: concat all sections elements...
        const elements = templateElementsBySectionId.nodes as TemplateElement[]
        const result = elements.map((element: TemplateElement) => {
          const { code: elementCode, elementTypePluginCode: pluginCode } = element
          return {
            templateId: id,
            sectionCode: code as string,
            sectionTitle: title as string,
            elementCode,
            pluginCode: pluginCode as string,
          }
        })

        // Add first and last element of page
        let page: Page = {
          templateId: id,
          sectionTitle: title as string,
          sectionCode: code as string,
        }
        result.forEach((element: FlattenType) => {
          const { firstElement, lastElement } = page

          if (!firstElement) page.firstElement = element.elementCode
          if (!lastElement && element.pluginCode === 'pagebreak')
            page.lastElement = element.elementCode

          if (page.firstElement && page.lastElement) {
            pages.push(page)
            page = { templateId: id, sectionTitle: title as string, sectionCode: code as string }
          }
        })
        if (page.firstElement && !page.lastElement) {
          pages.push({ ...page, lastElement: null })
        }
      })
      setApplicationState({ type: 'setPages', pages })
    }
  }, [data, error])

  useEffect(() => {
    const { pageNumber, pageIndex, pages, serialNumber } = applicationState
    if (serialNumber && pages) {
      if (pages === null || pageIndex === null) return
      const sectionCode = pages[pageIndex].sectionCode

      // Show the application current step (current pageNumber)
      if (sectionCode) replace(`${serialNumber}/${sectionCode}/page${pageNumber}`)
      else replace(`${serialNumber}/summary`)
    }
  }, [applicationState])

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
