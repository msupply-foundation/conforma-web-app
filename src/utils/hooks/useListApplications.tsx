import { useEffect, useState } from 'react'
import {
  Application,
  ApplicationStageHistory,
  useGetApplicationsQuery,
} from '../../utils/generated/graphql'
import { ApplicationDetails } from '../types'

const useListApplication = () => {
  const [applications, setApplications] = useState<ApplicationDetails[] | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { data, loading: apolloLoading, error: apolloError } = useGetApplicationsQuery({
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (apolloError) {
      setError(apolloError.message)
      return
    }
    if (data && data.applications) {
      const applicationsList = data?.applications?.nodes as Application[]
      const applicationsDetails: ApplicationDetails[] = applicationsList.map((application) => {
        const { id, serial, name, stage, status, outcome, template } = application
        const stages = application.applicationStageHistories.nodes as ApplicationStageHistory[]
        const stageId = stages.length > 0 ? stages[0].stage?.id : undefined

        return {
          id,
          type: template?.name as string,
          isLinear: template?.isLinear as boolean,
          serial: serial as string,
          name: name as string,
          stageId: stageId,
          stage: stage as string,
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
