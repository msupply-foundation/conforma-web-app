import { useEffect, useState } from 'react'
import buildFilter from '../helpers/list/buildQueryFilters'
import buildSortFields, { getPaginationVariables } from '../helpers/list/buildQueryVariables'
import { useGetApplicationsListQuery, ApplicationList } from '../../utils/generated/graphql'
import { BasicStringObject } from '../types'

const useListApplications = ({ sortBy, page, perPage, ...queryFilters }: BasicStringObject) => {
  const [applications, setApplications] = useState<ApplicationList[]>([])
  const [applicationCount, setApplicationCount] = useState<number>(0)
  const [error, setError] = useState('')

  const filters = buildFilter(queryFilters)
  const sortFields = sortBy ? buildSortFields(sortBy) : []
  const { paginationOffset, numberToFetch } = getPaginationVariables(
    page ? Number(page) : 1,
    perPage ? Number(perPage) : undefined
  )
  const { data, loading, error: applicationsError } = useGetApplicationsListQuery({
    variables: { filters, sortFields, paginationOffset, numberToFetch },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (applicationsError) {
      setError(applicationsError.message)
      return
    }
    if (data?.applicationLists) {
      const applicationsList = data?.applicationLists?.nodes
      setApplications(applicationsList as ApplicationList[])
      setApplicationCount(data?.applicationLists?.totalCount)
    }
  }, [data, applicationsError])

  return {
    error,
    loading,
    applications,
    applicationCount,
  }
}

export default useListApplications
