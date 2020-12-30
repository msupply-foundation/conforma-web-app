import { useEffect, useState } from 'react'
import { ApplicationStages, StageAndStatus, UseGetApplicationProps } from '../types'
import {
  Application,
  ApplicationStageStatusAll,
  TemplateStage,
  useGetApplicationStatusQuery,
} from '../generated/graphql'

const useGetApplicationStatus = ({ serialNumber, isApplicationLoaded }: UseGetApplicationProps) => {
  const [appStages, setAppStages] = useState<ApplicationStages>()
  const [appStatus, setAppStatus] = useState<StageAndStatus>()

  const { data, loading, error } = useGetApplicationStatusQuery({
    variables: {
      serial: serialNumber,
    },
    skip: !isApplicationLoaded,
  })

  useEffect(() => {
    if (data?.applicationBySerial && data?.applicationStageStatusAlls) {
      const application = data.applicationBySerial as Application
      const stagesStatusAll = data.applicationStageStatusAlls.nodes as ApplicationStageStatusAll[]
      const currentStage = stagesStatusAll[0]

      setAppStatus({
        stageId: currentStage ? (currentStage.stageId as number) : undefined,
        stage: currentStage ? (currentStage.stage as string) : '',
        status: application?.status as string,
      })

      const templateStages = application.template?.templateStages.nodes as TemplateStage[]

      setAppStages({
        stages: templateStages.map((stage) => ({
          number: stage.number as number,
          title: stage.title as string,
          description: stage.description ? stage.description : undefined,
        })),
        submissionMessage: application.template?.submissionMessage as string,
      })
    }
  }, [data, loading, error])

  return {
    error: error?.message,
    loading,
    appStatus,
    appStages,
  }
}

export default useGetApplicationStatus
