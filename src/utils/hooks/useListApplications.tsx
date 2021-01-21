import { useEffect, useState } from 'react'
import buildFilter from '../helpers/application/buildQueryFilters'
import buildSortFields, { getPaginationVariables } from '../helpers/application/buildQueryVariables'
import {
  ApplicationsOrderBy,
  useGetApplicationsListQuery,
  ApplicationList,
  ApplicationListsOrderBy,
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
  const [applications, setApplications] = useState<ApplicationList[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { type, sortBy, page, perPage } = urlFilters

  const filters = buildFilter(urlFilters)
  const sortFields = (sortBy ? buildSortFields(sortBy) : []) as ApplicationListsOrderBy[]
  const { paginationOffset, numberToFetch } = getPaginationVariables(
    page ? Number(page) : 1,
    perPage ? Number(perPage) : undefined
  )

  const { data, error: applicationsError } = useGetApplicationsListQuery({
    variables: { filters, sortFields, paginationOffset, numberToFetch },
    fetchPolicy: 'network-only',
    skip: !type,
  })

  console.log('data', data)
  console.log('error', error)

  useEffect(() => {
    if (applicationsError) {
      setError(applicationsError.message)
      return
    }
    if (data?.applicationLists) {
      const applicationsList = data?.applicationLists?.nodes
      setApplications(applicationsList as ApplicationList[])
      setLoading(false)
    }
  }, [data, applicationsError])

  return {
    error,
    loading,
    applications,
  }
}

export default useListApplications
