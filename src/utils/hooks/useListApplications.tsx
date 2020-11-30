import { useEffect, useState } from 'react'
import {
  Application,
  GetApplicationsQuery,
  Template,
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
    if (apolloError) return
    if (apolloLoading) return
    // Check that only one template matched
    let error = checkForApplicationsErrors(data)
    if (error) {
      setError(error)
      setLoading(false)
      return
    }

    const applicationsList = data?.applications?.nodes as Application[]
    const applicationsDetails: ApplicationDetails[] = applicationsList.map((application) => {
      const { id, serial, name, stage, status, outcome, template } = application
      return {
        id,
        type: template?.name as string,
        isLinear: template?.isLinear as boolean,
        serial: serial as string,
        name: name as string,
        stage: stage as string,
        status: status as string,
        outcome: outcome as string,
      }
    })
    setApplications(applicationsDetails)
    setLoading(false)
  }, [data, apolloError])

  return {
    error,
    loading,
    applications,
  }
}

function checkForApplicationsErrors(data: GetApplicationsQuery | undefined) {
  if (!data) return 'No data'
  if (!data.applications) return 'Unexpected list applications result'
  const numberOfApplications = data.applications.nodes.length as number
  if (numberOfApplications === 0) return 'No Applications found'
  if (data.applications.nodes.some((application) => !application?.template))
    return 'Unexpected template missing in one or more applications'
  return null
}

export default useListApplication
