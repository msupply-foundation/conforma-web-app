import { useState, useEffect } from 'react'
import {
  Application,
  ApplicationSection,
  TemplateElement,
  useGetApplicationQuery,
  ApplicationResponse,
} from '../../utils/generated/graphql'
import { SectionPages, SectionPageDetails, ResponsesByCode } from '../types'

interface useLoadApplicationProps {
  serialNumber: string
}

const useLoadApplication = (props: useLoadApplicationProps) => {
  const { serialNumber } = props
  const [applicationName, setName] = useState<string>('')
  const [applicationSections, setSections] = useState<SectionPages>({})
  const [responsesByCode, setResponsesByCode] = useState({})

  const { data, loading, error } = useGetApplicationQuery({
    variables: {
      serial: serialNumber,
    },
  })

  useEffect(() => {
    if (data && data.applications) {
      if (data.applications.nodes.length === 0) return
      if (data.applications.nodes.length > 1)
        console.log('More than one application returned. Only one expected!')
      const application = data.applications.nodes[0] as Application
      setName(application.name as string)

      // Find each section page details in application
      const sections = application?.applicationSections?.nodes as ApplicationSection[]

      const mapSectionsDetails: SectionPages = {}
      let startPage = 1 // Always start on page 1
      let previousStartPage = startPage
      sections.forEach((section) => {
        const { templateSection } = section
        if (templateSection) {
          const { id, code, title } = templateSection
          const elements = templateSection.templateElementsBySectionId.nodes as TemplateElement[]
          let totalPages = 1
          elements.forEach((element) => {
            if (element.elementTypePluginCode === 'PageBreak') totalPages++
          })
          const sectionPayload: SectionPageDetails = {
            id,
            code: code as string,
            title: title as string,
            startPage,
            totalPages,
          }
          mapSectionsDetails[code as string] = sectionPayload
          startPage = previousStartPage + totalPages // Update the next section start page
        }
      })
      setSections(mapSectionsDetails)

      // Build application responsesByCode object -- TO:DO add to Context applicationState
      const applicationResponses = data?.applications?.nodes[0]?.applicationResponses
        .nodes as ApplicationResponse[]

      const currentResponses = {} as ResponsesByCode

      applicationResponses.forEach((response) => {
        const code = response?.templateElement?.code
        if (code) currentResponses[code] = response?.value?.text || response?.value
      })

      setResponsesByCode(currentResponses)
    }
  }, [data, error])

  return {
    error,
    loading,
    applicationName,
    applicationSections,
    responsesByCode,
  }
}

export default useLoadApplication
