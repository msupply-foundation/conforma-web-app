import { useEffect, useState } from 'react'
import { StageAndStatus, UseGetApplicationProps } from '../types'
import {
  Application,
  ApplicationStageStatusAll,
  useGetStagesAndStatusQuery,
} from '../generated/graphql'

const useGetApplicationStatus = ({
  serialNumber,
  isApplicationLoaded = true,
}: UseGetApplicationProps) => {
  const [appStatus, setAppStatus] = useState<StageAndStatus>()

  const { data, loading, error } = useGetStagesAndStatusQuery({
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
    }
  }, [data, loading, error])

  return {
    error: error?.message,
    loading,
    appStatus,
  }
}

export default useGetApplicationStatus
