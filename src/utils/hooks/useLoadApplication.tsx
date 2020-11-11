import { useEffect, useState } from 'react'
import { Application, useGetApplicationQuery } from '../../utils/generated/graphql'
import { getApplicationSections } from '../helpers/getSectionsPayload'
import { TemplateSectionPayload } from '../types'

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
  const [templateSections, setSections] = useState<TemplateSectionPayload[]>([])
  const [appStatus, setAppStatus] = useState({})
  const [isReady, setIsReady] = useState(false)

  const { data, loading, error } = useGetApplicationQuery({
    variables: {
      serial: serialNumber,
    },
    skip: isReady,
  })

  useEffect(() => {
    if (data && data.applicationBySerial) {
      const application = data.applicationBySerial as Application
      setApplication({ name: application.name as string, id: application.id })

      const sections = getApplicationSections(application.applicationSections)
      setSections(sections)

      setAppStatus({
        stage: application?.stage,
        status: application?.status,
        outcome: application?.outcome,
      })
      setIsReady(true)
    }
  }, [data, loading, error])

  return {
    error,
    loading,
    application,
    templateSections,
    appStatus,
  }
}

export default useLoadApplication
