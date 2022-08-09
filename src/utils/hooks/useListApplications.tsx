import { useEffect, useState } from 'react'
import { useRouter } from '../hooks/useRouter'
import buildFilter from '../helpers/list/buildQueryFilters'
import buildSortFields, { getPaginationVariables } from '../helpers/list/buildQueryVariables'
import { useGetApplicationListQuery, ApplicationListShape } from '../../utils/generated/graphql'
import { BasicStringObject, TemplateType } from '../types'
import { useUserState } from '../../contexts/UserState'
import { useApplicationFilters } from '../data/applicationFilters'
import { usePrefs } from '../../contexts/SystemPrefs'

const useListApplications = ({
  sortBy,
  page,
  perPage,
  type,
  ...queryFilters
}: BasicStringObject) => {
  const { loading: loadingPrefs, preferences } = usePrefs()
  const APPLICATION_FILTERS = useApplicationFilters(preferences?.defaultListFilters || [])
  const [applications, setApplications] = useState<ApplicationListShape[]>([])
  const [applicationCount, setApplicationCount] = useState<number>(0)
  const [templateType, setTemplateType] = useState<TemplateType>()
  const [error, setError] = useState('')
  const { updateQuery } = useRouter()
  const {
    userState: { currentUser },
  } = useUserState()

  const filters = buildFilter({ type, ...queryFilters }, APPLICATION_FILTERS)
  const sortFields = sortBy ? buildSortFields(sortBy) : []
  const { paginationOffset, numberToFetch } = getPaginationVariables(
    page ? Number(page) : 1,
    perPage ? Number(perPage) : undefined
  )
  const {
    data,
    loading,
    refetch,
    error: applicationsError,
  } = useGetApplicationListQuery({
    variables: {
      filters,
      sortFields,
      paginationOffset,
      numberToFetch,
      userId: currentUser?.userId as number,
      templateCode: type || '',
    },
    fetchPolicy: 'network-only',
    skip: loadingPrefs
  })

  // Ensures that query doesn't request a page beyond the available total
  useEffect(() => {
    const pageNum = Number(page) || 1
    const perPageNum = Number(perPage) || 20
    const totalPages = Math.ceil(applicationCount / perPageNum)
    if (pageNum > (totalPages > 0 ? totalPages : 1)) updateQuery({ page: totalPages })
  }, [applicationCount])

  useEffect(() => {
    if (applicationsError) {
      setError(applicationsError.message)
      return
    }
    if (data?.applicationList) {
      const applicationsList = data?.applicationList?.nodes
      setApplications(applicationsList as ApplicationListShape[])
      setApplicationCount(data?.applicationList?.totalCount)
    }
    if (data?.templates?.nodes && data?.templates?.nodes.length > 0) {
      const { code, name, namePlural } = data?.templates?.nodes?.[0] as TemplateType
      setTemplateType({ code, name, namePlural })
    }
  }, [data, applicationsError])

  return {
    error,
    loading,
    refetch,
    templateType,
    applications,
    applicationCount,
  }
}

export default useListApplications
