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

const useListApplication = ({ query: urlFilters, type }: UseListApplicationsProps) => {
  const [applications, setApplications] = useState<ApplicationDetailsMap>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const filters = buildFilter(urlFilters)
  console.log('filters', filters)
  const sortFields: any = ['SERIAL_ASC']
  // buildSortFields(urlFilters?.sortBy) || []

  const { data, error: applicationsError } = useGetApplicationsQuery({
    variables: { filters },
    fetchPolicy: 'network-only',
    skip: !type,
  })

  console.log('data', data)

  const { data: stagesData, error: stagesError } = useGetApplicationsStagesQuery({
    variables: { serials: applications ? Object.keys(applications) : [] },
    skip: !applications,
  })

  useEffect(() => {
    if (applicationsError) {
      setError(applicationsError.message)
      return
    }
    if (data?.applications) {
      const applicationsList = data?.applications?.nodes as Application[]
      const applicationsMap = applicationsList.reduce(
        (applicationsMap: ApplicationDetailsMap, application) => {
          const { id, serial, name, stage, status, outcome, template } = application
          return {
            ...applicationsMap,
            [serial as string]: {
              id,
              type: template?.name as string,
              isLinear: template?.isLinear as boolean,
              serial: serial as string,
              name: name as string,
              status: status as string,
              outcome: outcome as string,
            },
          }
        },
        {}
      )
      setApplications(applicationsMap)
    }
  }, [data, applicationsError])

  useEffect(() => {
    if (stagesError) {
      setError(stagesError.message)
      return
    }

    console.log('applications', applications)

    if (applications) {
      if (stagesData?.applicationStageStatusAlls) {
        const allApplicationsStageStatus = stagesData.applicationStageStatusAlls
          .nodes as ApplicationStageStatusAll[]

        let applicationsWithStage: ApplicationDetailsMap = applications
        Object.entries(applications).forEach(([applicationSerial, details]) => {
          const stageFound = allApplicationsStageStatus.find(
            ({ serial }) => serial === applicationSerial
          )

          if (stageFound) {
            applicationsWithStage[applicationSerial] = {
              ...details,
              stage: {
                id: stageFound.stageId as number,
                name: stageFound.stage as string,
                status: stageFound.status as string,
                date: stageFound.statusHistoryTimeCreated.split('T')[0],
              },
            }
          }
        })
        setApplications(applicationsWithStage)
      }
      setLoading(false)
    }
  }, [applications, stagesData, stagesError])

  return {
    error,
    loading,
    applications,
  }
}

export default useListApplications
