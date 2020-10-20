import { useState, useEffect } from 'react'
import {
  Application,
  ApplicationSection,
  useGetApplicationQuery,
} from '../../utils/generated/graphql'

interface useLoadApplicationProps {
  serialNumber: number
}

const useLoadApplication = (props: useLoadApplicationProps) => {
  const { serialNumber } = props
  const [currentSection, setCurrentSection] = useState<string | null>(null)

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

      // Check the return application has sections
      if (!application.applicationSections || application.applicationSections.nodes.length === 0)
        return

      // Find title of first section in application
      const section = application.applicationSections.nodes[0] as ApplicationSection
      const { templateSection } = section
      if (!templateSection) return

      // TODO: Remove elements not visible in the current stage...

      const { code } = templateSection
      setCurrentSection(code as string)
    }
  }, [data, error])

  return {
    error,
    loading,
    currentSection,
  }
}

export default useLoadApplication
