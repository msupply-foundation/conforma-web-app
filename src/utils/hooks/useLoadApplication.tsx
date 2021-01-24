import { useEffect, useState } from 'react'
import {
  Application,
  ApplicationStageStatusAll,
  TemplateStage,
  useGetApplicationQuery,
  useGetApplicationStatusQuery,
} from '../../utils/generated/graphql'
import useTriggerProcessing from '../../utils/hooks/useTriggerProcessing'
import getApplicationStatusQuery from '../graphql/queries/getApplicationStatus.query'
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
  const [isApplicationLoaded, setIsApplicationLoaded] = useState(false)
  const [checkTrigger, setCheckTrigger] = useState(false)
  const [applicationError, setApplicationError] = useState('')

  const { data, loading, error } = useGetApplicationQuery({
    variables: {
      serial: serialNumber,
    },
    skip: isApplicationLoaded,
    fetchPolicy: networkFetch ? 'network-only' : 'cache-first',
  })

  const { triggerProcessing, error: triggerError } = useTriggerProcessing({
    checkTrigger,
    serialNumber,
    // triggerType: 'applicationTrigger',
  })

  const { data: data2, loading: loading2, error: error2 } = useGetApplicationStatusQuery({
    variables: { serial: serialNumber },
    skip: !application || triggerProcessing,
  })

  useEffect(() => {
    if (error) {
      setApplicationError(error.message)
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

      setCheckTrigger(true)
      // setIsApplicationLoaded(true)
    }
  }, [data, loading, error])

  useEffect(() => {
    if (error2) {
      setApplicationError(error2.message)
    }

    if (
      application &&
      data2?.applicationStageStatusAlls &&
      data2?.applicationStageStatusAlls.nodes.length > 0
    ) {
      const stages = data2.applicationStageStatusAlls.nodes as ApplicationStageStatusAll[]
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
      console.log('Status', status, 'Trigger', triggerProcessing)

      setIsApplicationLoaded(true)
    }
  }, [data2, error2, triggerProcessing])

  return {
    error: error || triggerError,
    loading: loading || triggerProcessing,
    application,
    appStages,
    templateSections,
    isApplicationLoaded,
  }
}

export default useLoadApplication
