import { useEffect, useState } from 'react'
import {
  Application,
  ApplicationStageStatusAll,
  useGetApplicationQuery,
} from '../../utils/generated/graphql'
import useTriggerProcessing from '../../utils/hooks/useTriggerProcessing'
import { getApplicationSections } from '../helpers/getSectionsPayload'
import { ApplicationDetails, AppStatus, TemplateSectionPayload } from '../types'

interface useLoadApplicationProps {
  serialNumber: string
}

const useLoadApplication = (props: useLoadApplicationProps) => {
  const { serialNumber } = props
  const [application, setApplication] = useState<ApplicationDetails>()
  const [templateSections, setSections] = useState<TemplateSectionPayload[]>([])
  const [appStatus, setAppStatus] = useState<AppStatus>()
  const [isApplicationLoaded, setIsApplicationLoaded] = useState(false)

  const { triggerProcessing, error: triggerError } = useTriggerProcessing({
    serialNumber,
    trigger: 'applicationTrigger',
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
      const stagesStatusAll = data.applicationStageStatusAlls.nodes as ApplicationStageStatusAll[]
      const currentStage = stagesStatusAll[0]

      const applicationDetails = {
        id: application.id,
        type: application.template?.name as string,
        isLinear: application.template?.isLinear as boolean,
        serial: application.serial as string,
        name: application.name as string,
        stageId: currentStage ? (currentStage.stageId as number) : undefined,
        stage: currentStage ? (currentStage.stage as string) : '',
        status: application.status as string,
        outcome: application.outcome as string,
      }

      setApplication(applicationDetails)

      const sections = getApplicationSections(application.applicationSections)
      setSections(sections)

      setAppStatus({
        stage: currentStage ? (currentStage.stage as string) : '',
        status: application?.status as string,
        outcome: application?.outcome as string,
      })
      setIsApplicationLoaded(true)
    }
  }, [data, loading, error])

  return {
    error: error || triggerError,
    loading: loading || triggerProcessing,
    application,
    templateSections,
    appStatus,
    isApplicationLoaded,
  }
}

export default useLoadApplication
