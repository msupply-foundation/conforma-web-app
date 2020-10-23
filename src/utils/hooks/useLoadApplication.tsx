import { useState, useEffect } from 'react'
import {
  Application,
  ApplicationSection,
  TemplateElement,
  useGetApplicationQuery,
} from '../../utils/generated/graphql'

interface useLoadApplicationProps {
  serialNumber: string
}

const useLoadApplication = (props: useLoadApplicationProps) => {
  const { serialNumber } = props
  const [applicationName, setName] = useState<string>('')

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
    }
  }, [data, error])

  return {
    error,
    loading,
    applicationName,
  }
}

export default useLoadApplication
