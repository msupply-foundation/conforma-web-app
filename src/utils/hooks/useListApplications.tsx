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

  const { data, loading: apolloLoading, error: apolloError } = useGetApplicationsQuery()

  useEffect(() => {
    if (apolloError) return
    if (apolloLoading) return
    // Check that only one tempalte matched
    let error = checkForApplicationsErrors(data)
    if (error) {
      setError(error)
      setLoading(false)
      return
    }

    const applicationsList = data?.applications?.nodes as Application[]
    const applicationsDetails: ApplicationDetails[] = applicationsList.map((application) => {
      const { serial, name, stage, status, outcome, template } = application
      const { name: type } = template as Template
      return {
        type: type as string,
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
  // TODO: Better error handling
  if (!data?.applications) return 'Unexpected list applications result'
  const numberOfTemplates = data.applications.nodes.length as number
  if (numberOfTemplates === 0) return 'Applications not found'
  return null
}

export default useListApplication
