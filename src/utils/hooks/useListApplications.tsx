import { useEffect, useState } from 'react'
import {
  Application,
  ApplicationStageHistory,
  GetApplicationsQuery,
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
    const applicationsDetails: ApplicationDetails[] = applicationsList.reduce(
      (validApplications: ApplicationDetails[], application) => {
        const applicationDetails = checkForValidApplication(application)
        if (applicationDetails) return [...validApplications, applicationDetails]
        return validApplications
      },
      []
    )
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

  // const problemsInApplications: string[] = []
  const numberOfApplications = data.applications.nodes.length as number
  if (numberOfApplications === 0) return 'No Applications found'
  data.applications.nodes.forEach((application) => {
    const { id, template } = application as Application
    if (!template) console.log(`Application id ${id} is missing a template link`)
    // if (!template) problemsInApplications.push(`Application id ${id} is missing a template link`)
  })
  data?.applications.nodes.forEach((application) => {
    const { id, applicationStageHistories } = application as Application
    if (!applicationStageHistories || applicationStageHistories.nodes.length === 0)
      console.log(`Application id ${id} is missing a template link`)
    // problemsInApplications.push(`Application id ${id} is missing the current stage`)
  })
  // if (problemsInApplications.length > 0) return JSON.stringify(problemsInApplications)
  return null
}

function checkForValidApplication(application: Application): ApplicationDetails | null {
  const { id, serial, name, status, outcome, template, applicationStageHistories } = application
  const stages = application.applicationStageHistories.nodes as ApplicationStageHistory[]

  if (
    !id ||
    !serial ||
    !name ||
    !status ||
    !outcome ||
    !template ||
    !applicationStageHistories ||
    stages.length === 0
  )
    return null

  const { id: stageId } = stages[0]
  return {
    id,
    type: template?.name as string,
    isLinear: template?.isLinear as boolean,
    serial: serial as string,
    name: name as string,
    stageId: stageId,
    status: status as string,
    outcome: outcome as string,
  }
}

export default useListApplication
