import { useEffect, useState } from 'react'
import { Application, useGetApplicationQuery } from '../../utils/generated/graphql'
import useTriggerProcessing from '../../utils/hooks/useTriggerProcessing'
import { getApplicationSections } from '../helpers/getSectionsPayload'
import { TemplateSectionPayload } from '../types'

interface useLoadApplicationProps {
  serialNumber: string
  skip: boolean
}

interface ApplicationDetails {
  name: string
  id: number
}

const useLoadApplication = (props: useLoadApplicationProps) => {
  const { serialNumber, skip } = props
  const [application, setApplication] = useState<ApplicationDetails | undefined>()
  const [templateSections, setSections] = useState<TemplateSectionPayload[]>([])
  const [appStatus, setAppStatus] = useState({})

  const { triggerProcessing } = useTriggerProcessing({ serialNumber, table: 'application' })

  const { data, loading, error } = useGetApplicationQuery({
    variables: {
      serial: serialNumber,
    },
    skip: skip,
  })

  useEffect(() => {
    if (data && data.applications) {
      if (data.applications.nodes.length === 0) return
      if (data.applications.nodes.length > 1)
        console.log('More than one application returned. Only one expected!')
      const application = data.applications.nodes[0] as Application
      setApplication({ name: application.name as string, id: application.id })

      const sections = getApplicationSections(application.applicationSections)
      setSections(sections)

      setAppStatus({
        stage: application?.stage,
        status: application?.status,
        outcome: application?.outcome,
      })
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
