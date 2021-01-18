import { useEffect, useState } from 'react'
import {
  Application,
  ApplicationStageStatusAll,
  useGetApplicationQuery,
} from '../../utils/generated/graphql'
import useTriggerProcessing from '../../utils/hooks/useTriggerProcessing'
import { getApplicationSections } from '../helpers/application/getSectionsPayload'
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
    if (data?.applicationBySerial) {
      const application = data.applicationBySerial as Application

      let applicationDetails: ApplicationDetails = {
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
          date: statusHistoryTimeCreated.toISOString().split('T')[0],
        }
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
