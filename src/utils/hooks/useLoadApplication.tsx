import { useEffect, useState } from 'react'
import { Application, useGetApplicationQuery } from '../../utils/generated/graphql'

interface useLoadApplicationProps {
  serialNumber: string
}

interface ApplicationDetails {
  name: string
  id: number
}

const useLoadApplication = (props: useLoadApplicationProps) => {
  const { serialNumber } = props
  const [application, setApplication] = useState<ApplicationDetails | undefined>()

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
      setApplication({ name: application.name as string, id: application.id })
    }
  }, [data, loading, error])

  return {
    error,
    loading,
    application,
  }
}

export default useLoadApplication
