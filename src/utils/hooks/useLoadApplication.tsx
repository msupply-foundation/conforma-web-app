import { useState, useEffect } from 'react'
import {
  Application,
  ApplicationSection,
  TemplateElement,
  useGetApplicationQuery,
} from '../../utils/generated/graphql'
import { SectionPages, SectionPageDetails } from '../types'

interface useLoadApplicationProps {
  serialNumber: string
}

// const useLoadApplication = (props: useLoadApplicationProps) => {
//   const { serialNumber } = props
//   const [currentSection, setCurrentSection] = useState<string | null>(null)

//   const { data, loading, error } = useGetApplicationQuery({
//     variables: {
//       serial: serialNumber,
//     },
//   })

//   useEffect(() => {
//     if (data && data.applications) {
//       if (data.applications.nodes.length === 0) return
//       if (data.applications.nodes.length > 1)
//         console.log('More than one application returned. Only one expected!')
//       const application = data.applications.nodes[0] as Application

//       // Check the return application has sections
//       if (!application.applicationSections || application.applicationSections.nodes.length === 0)
//         return

//       // Find title of first section in application
//       const section = application.applicationSections.nodes[0] as ApplicationSection
//       const { templateSection } = section
//       if (!templateSection) return

//       // TODO: Remove elements not visible in the current stage...

//       const { code } = templateSection
//       setCurrentSection(code as string)
//     }
//   }, [data, error])

//   return {
//     error,
//     loading,
//     currentSection,
//   }
// }

// export default useLoadApplication

const useLoadApplication = (props: useLoadApplicationProps) => {
  const { serialNumber } = props
  const [applicationName, setName] = useState<string>('')
  const [applicationSections, setSections] = useState<SectionPages>({})

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
    }
  }, [data, error])

  return {
    error,
    loading,
    applicationName,
    applicationSections,
  }
}

export default useLoadApplication
