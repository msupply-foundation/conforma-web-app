import { useEffect, useState } from 'react'
import {
  Application,
  ApplicationStageStatusAll,
  useGetApplicationsQuery,
} from '../../utils/generated/graphql'
import { ApplicationDetails } from '../types'

interface UseListApplicationsProps {
  type?: string
}

const useListApplication = ({ type }: UseListApplicationsProps) => {
  const [applications, setApplications] = useState<ApplicationDetails[] | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { data, loading: apolloLoading, error: apolloError } = useGetApplicationsQuery({
    variables: { code: type as string },
    fetchPolicy: 'network-only',
    skip: !type,
  })

  useEffect(() => {
    if (apolloError) {
      setError(apolloError.message)
      return
    }
    if (data && data.applications && data.applicationStageStatusAlls) {
      const applicationsList = data?.applications?.nodes as Application[]
      const stagesStatusAll = data.applicationStageStatusAlls.nodes as ApplicationStageStatusAll[]
      const applicationsDetails: ApplicationDetails[] = applicationsList.map((application) => {
        const { id, serial, name, stage, status, outcome, template } = application
        const findStageStatus = stagesStatusAll.find(
          ({ serial: applicationSerial }) => applicationSerial === serial
        )

        return {
          id,
          type: template?.name as string,
          isLinear: template?.isLinear as boolean,
          serial: serial as string,
          name: name as string,
          stageId: findStageStatus ? (findStageStatus.stageId as number) : undefined,
          stage: findStageStatus ? (findStageStatus.stage as string) : '',
          status: status as string,
          outcome: outcome as string,
        }
      })
      setApplications(applicationsDetails)
      setLoading(false)
    }
  }, [data, apolloError])

  return {
    error,
    loading,
    applications,
  }
}

export default useListApplication
