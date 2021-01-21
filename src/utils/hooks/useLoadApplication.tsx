import { useEffect, useState } from 'react'
import {
  Application,
  ApplicationStageStatusAll,
  TemplateStage,
  useGetApplicationQuery,
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
    fetchPolicy: networkFetch ? 'no-cache' : 'cache-first',
  })

  useEffect(() => {
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

      if (data?.applicationStageStatusAlls && data?.applicationStageStatusAlls.nodes.length > 0) {
        const stages = data.applicationStageStatusAlls.nodes as ApplicationStageStatusAll[]
        if (stages.length > 1)
          console.log('StageStatusAll More than one results for 1 application!')
        const { stageId, stage, status, statusHistoryTimeCreated } = stages[0] // Should only have one result
        applicationDetails.stage = {
          id: stageId as number,
          name: stage as string,
          status: status as string,
          date: statusHistoryTimeCreated.split('T')[0],
        }
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
  }, [data, loading, error])

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
