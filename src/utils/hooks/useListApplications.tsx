import { useEffect, useState } from 'react'
import buildFilter from '../helpers/application/buildQueryFilters'
import buildSortFields from '../helpers/application/buildSortFields'
import {
  Application,
  ApplicationsOrderBy,
  ApplicationStageStatusAll,
  useGetApplicationsQuery,
  useGetApplicationsStagesQuery,
} from '../../utils/generated/graphql'
import { ApplicationDetails } from '../types'

interface UseListApplicationsProps {
  query?: any
  type?: string
}

interface ApplicationDetailsMap {
  [serial: string]: ApplicationDetails
}

const useListApplications = ({ query: urlFilters, type }: UseListApplicationsProps) => {
  const [applications, setApplications] = useState<any[]>([])
  const [stagesDataObject, setStagesDataObject] = useState<any>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const filters = buildFilter(urlFilters)
  console.log('filters', filters)
  const sortFields: any = buildSortFields(urlFilters?.sortBy) || []

  const { data, error: applicationsError } = useGetApplicationsQuery({
    variables: { filters, sortFields },
    fetchPolicy: 'network-only',
    skip: !type,
  })

  const { data: stagesData, error: stagesError } = useGetApplicationsStagesQuery({
    variables: {
      serials: applications ? applications.map((application: any) => application.serial) : [],
    },
    skip: !applications,
  })

  useEffect(() => {
    if (stagesError) {
      setError(stagesError.message)
      return
    }
    if (applicationsError) {
      setError(applicationsError.message)
      return
    }
    if (!stagesData) return
    if (data?.applications && stagesData?.applicationStageStatusAlls) {
      const applicationsList = data?.applications?.nodes as Application[]
      const stagesList = stagesData?.applicationStageStatusAlls?.nodes as Application[]

      // Get stages array as object indexed by serial
      const stagesMapToObject: any[] = stagesList.reduce((stagesMap: any, stageStatus: any) => {
        const { serial, stage, stageId, status, statusHistoryTimeCreated } = stageStatus
        return {
          ...stagesMap,
          [serial]: {
            id: stageId,
            name: stage,
            status: status,
            date: statusHistoryTimeCreated.split('T')[0],
          },
        }
      }, {})

      // Add those stages to applications and update Applications state
      const applicationsWithStages = applicationsList.map((application: any) => {
        const { id, serial, name, stage, status, outcome, template } = application
        return {
          id,
          serial,
          type: template?.name,
          isLinear: template?.isLinear,
          name,
          outcome,
          stage: stagesMapToObject[application.serial],
        }
      })
      setApplications(applicationsWithStages)
      setLoading(false)
    }
  }, [stagesData, stagesError, data, applicationsError])

  return {
    error,
    loading,
    applications,
  }
}

export default useListApplications
