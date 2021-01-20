import { useEffect, useState } from 'react'
import buildFilter from '../helpers/application/buildQueryFilters'
import buildSortFields, { getPaginationVariables } from '../helpers/application/buildQueryVariables'
import {
  ApplicationsOrderBy,
  useGetApplicationsQuery,
  useGetApplicationsStagesQuery,
} from '../../utils/generated/graphql'
import { ApplicationDetails } from '../types'
import { DateTime } from 'luxon'

export type URLQueryFilter = {
  [key: string]: string
}

interface UseListApplicationsProps {
  urlFilters: URLQueryFilter
}

const useListApplications = ({ urlFilters }: UseListApplicationsProps) => {
  const [applications, setApplications] = useState<ApplicationDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { type, sortBy, page, perPage } = urlFilters

  const filters = buildFilter(urlFilters)
  const sortFields = (sortBy ? buildSortFields(sortBy) : []) as ApplicationsOrderBy[]
  const { paginationOffset, numberToFetch } = getPaginationVariables(
    page ? Number(page) : 1,
    perPage ? Number(perPage) : undefined
  )

  const { data, error: applicationsError } = useGetApplicationsQuery({
    variables: { filters, sortFields, paginationOffset, numberToFetch },
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
      const applicationsList = data?.applications?.nodes
      const stagesList = stagesData?.applicationStageStatusAlls?.nodes

      // Get stages array as object indexed by serial
      const stagesMapToObject = stagesList.reduce((stagesMap: any, stageStatus: any) => {
        const { serial, stage, stageId, status, statusHistoryTimeCreated } = stageStatus
        return {
          ...stagesMap,
          [serial]: {
            id: stageId,
            name: stage,
            status: status,
            date: DateTime.fromISO(statusHistoryTimeCreated).toISODate(),
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
          stage: stagesMapToObject?.[application.serial],
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
