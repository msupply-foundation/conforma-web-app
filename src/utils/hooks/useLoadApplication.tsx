import { useEffect, useState } from 'react'
import {
  Application,
  ApplicationStageStatusAll,
  useGetApplicationQuery,
} from '../../utils/generated/graphql'
import useTriggerProcessing from '../../utils/hooks/useTriggerProcessing'
import { getApplicationSections } from '../helpers/getSectionsPayload'
import { ApplicationDetails, TemplateSectionPayload, UseGetApplicationProps } from '../types'

const useLoadApplication = (props: UseGetApplicationProps) => {
  const { serialNumber } = props
  const [application, setApplication] = useState<ApplicationDetails>()
  const [templateSections, setSections] = useState<TemplateSectionPayload[]>([])
  const [isApplicationLoaded, setIsApplicationLoaded] = useState(false)

  const { triggerProcessing, error: triggerError } = useTriggerProcessing({
    serialNumber,
    // triggerType: 'applicationTrigger',
  })

  const { data, loading, error } = useGetApplicationQuery({
    variables: {
      serial: serialNumber,
    },
    skip: triggerProcessing || isApplicationLoaded,
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (data && data.applicationBySerial && data.applicationStageStatusAlls) {
      const application = data.applicationBySerial as Application

      const applicationDetails = {
        id: application.id,
        type: application.template?.name as string,
        isLinear: application.template?.isLinear as boolean,
        serial: application.serial as string,
        name: application.name as string,
        stage: application.stage ? (application.stage as string) : '',
        status: application.status as string,
        outcome: application.outcome as string,
      }

      setApplication(applicationDetails)

      const sections = getApplicationSections(application.applicationSections)
      setSections(sections)
      setIsApplicationLoaded(true)
    }
  }, [data, loading, error])

  return {
    error: error || triggerError,
    loading: loading || triggerProcessing,
    application,
    templateSections,
    isApplicationLoaded,
  }
}

export default useLoadApplication
