import { useEffect, useState } from 'react'
import {
  Application,
  ApplicationStageStatusAll,
  TemplateStage,
  useGetApplicationQuery,
  useGetApplicationStatusQuery,
} from '../../utils/generated/graphql'
import useTriggerProcessing from '../../utils/hooks/useTriggerProcessing'
import { getApplicationSections } from '../helpers/application/getSectionsPayload'
import {
  ApplicationDetails,
  ApplicationStages,
  TemplateSectionPayload,
  UseGetApplicationProps,
} from '../types'

const useLoadApplication = ({ serialNumber, networkFetch }: UseGetApplicationProps) => {
  const [application, setApplication] = useState<ApplicationDetails>()
  const [templateSections, setSections] = useState<TemplateSectionPayload[]>([])
  const [appStages, setAppStages] = useState<ApplicationStages>()
  const [isApplicationReady, setIsApplicationReady] = useState(false)
  const [isApplicationLoaded, setIsApplicationLoaded] = useState(false)
  const [applicationError, setApplicationError] = useState<string>()

  const { data, loading, error } = useGetApplicationQuery({
    variables: {
      serial: serialNumber,
    },
    skip: isApplicationReady,
    fetchPolicy: networkFetch ? 'network-only' : 'cache-first',
  })

  const { error: triggerError, isTriggerProcessing } = useTriggerProcessing({
    isApplicationLoaded,
    serialNumber,
    // triggerType: 'applicationTrigger',
  })

  const {
    data: statusData,
    loading: statusLoading,
    error: statusError,
  } = useGetApplicationStatusQuery({
    variables: { serial: serialNumber },
    skip: !isApplicationLoaded || isTriggerProcessing,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (isApplicationReady) return
    if (!loading && !data?.applicationBySerial) {
      setApplicationError('No application found')
      return
    }

    if (data?.applicationBySerial) {
      const application = data.applicationBySerial as Application

      const applicationDetails: ApplicationDetails = {
        id: application.id,
        type: application.template?.name as string,
        isLinear: application.template?.isLinear as boolean,
        serial: application.serial as string,
        name: application.name as string,
        outcome: application.outcome as string,
      }

      setApplication(applicationDetails)

      const sections = getApplicationSections(application.applicationSections)
      setSections(sections)

      const templateStages = application.template?.templateStages.nodes as TemplateStage[]

      setAppStages({
        stages: templateStages.map((stage) => ({
          number: stage.number as number,
          title: stage.title as string,
          description: stage.description ? stage.description : undefined,
        })),
        submissionMessage: application.template?.submissionMessage as string,
      })

      setIsApplicationLoaded(true)
    }
  }, [data, loading])

  useEffect(() => {
    if (application) {
      if (!statusData?.applicationStageStatusAlls?.nodes) {
        setApplicationError('No status found')
        return
      }

      const stages = statusData.applicationStageStatusAlls.nodes as ApplicationStageStatusAll[]
      if (stages.length > 1) console.log('StageStatusAll More than one results for 1 application!')
      const { stageId, stage, status, statusHistoryTimeCreated } = stages[0] // Should only have one result
      setApplication({
        ...application,
        stage: {
          id: stageId as number,
          name: stage as string,
          status: status as string,
          date: statusHistoryTimeCreated.split('T')[0],
        },
      })
      setIsApplicationReady(true)
    }
  }, [statusData, statusError])

  return {
    error: error
      ? (error.message as string)
      : statusError
      ? (statusError.message as string)
      : applicationError || triggerError,
    loading: loading || statusLoading || isTriggerProcessing,
    application,
    appStages,
    templateSections,
    isApplicationReady,
  }
}

export default useLoadApplication
