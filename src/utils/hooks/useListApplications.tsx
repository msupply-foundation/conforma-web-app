import { useEffect, useState } from 'react'
import buildFilter from '../helpers/list/buildQueryFilters'
import buildSortFields, { getPaginationVariables } from '../helpers/list/buildQueryVariables'
import { useGetApplicationsListQuery, ApplicationList } from '../../utils/generated/graphql'
import { BasicStringObject } from '../types'

const useListApplications = (queryFilters: BasicStringObject) => {
  const [applications, setApplications] = useState<ApplicationList[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { type, sortBy, page, perPage } = queryFilters

  const filters = buildFilter(queryFilters)
  const sortFields = sortBy ? buildSortFields(sortBy) : []
  const { paginationOffset, numberToFetch } = getPaginationVariables(
    page ? Number(page) : 1,
    perPage ? Number(perPage) : undefined
  )

  const { data, error: applicationsError } = useGetApplicationsListQuery({
    variables: { filters, sortFields, paginationOffset, numberToFetch },
    fetchPolicy: 'network-only',
    skip: !type,
  })

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
