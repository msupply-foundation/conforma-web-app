import { useEffect, useState } from 'react'
import { useRouter } from '../hooks/useRouter'
import { usePrefs } from '../../contexts/SystemPrefs'
import buildFilter from '../helpers/list/buildQueryFilters'
import buildSortFields, { getPaginationVariables } from '../helpers/list/buildQueryVariables'
import {
  useGetApplicationListQuery,
  ApplicationListShape,
  ApplicationListShapesOrderBy,
  useGetFilteredApplicationCountLazyQuery,
} from '../../utils/generated/graphql'
import { BasicStringObject, TemplateType } from '../types'
import { useUserState } from '../../contexts/UserState'
import { useGetFilterDefinitions } from '../helpers/list/useGetFilterDefinitions'

const useListApplications = (
  { sortBy, page, perPage, type, ...queryFilters }: BasicStringObject,
  graphQLFilterObject?: object
) => {
  const FILTER_DEFINITIONS = useGetFilterDefinitions()
  const [applications, setApplications] = useState<ApplicationListShape[]>([])
  const [applicationCount, setApplicationCount] = useState<'loading' | number>('loading')
  const [templateType, setTemplateType] = useState<TemplateType>()
  const [error, setError] = useState('')
  const { updateQuery } = useRouter()
  const {
    userState: { currentUser },
  } = useUserState()
  const { preferences } = usePrefs()

  // The "filters" object is either passed in already constructed
  // (graphQLFilterObject), OR we'll need to "buildFilters" from url query key-values.
  const filters = graphQLFilterObject
    ? graphQLFilterObject
    : buildFilter({ type, ...queryFilters }, FILTER_DEFINITIONS)
  const sortFields = sortBy
    ? buildSortFields(sortBy)
    : [ApplicationListShapesOrderBy.LastActiveDateDesc]
  const { paginationOffset, numberToFetch } = getPaginationVariables(
    page ? Number(page) : 1,
    perPage ? Number(perPage) : preferences?.paginationDefault ?? 20
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
  })

  const [getListCount, { loading: loadingCount, data: countData }] =
    useGetFilteredApplicationCountLazyQuery({
      fetchPolicy: 'network-only',
    })

  // Ensures that query doesn't request a page beyond the available total
  useEffect(() => {
    if (applicationCount == 'loading') {
      return
    }
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
      // Fetch counts
      getListCount({
        variables: { filter: filters, userId: currentUser?.userId as number },
      })
    }
    if (data?.templates?.nodes && data?.templates?.nodes.length > 0) {
      const { code, name, namePlural } = data?.templates?.nodes?.[0] as TemplateType
      setTemplateType({ code, name, namePlural })
    }
  }, [data, applicationsError])

  useEffect(() => {
    if (loadingCount) {
      setApplicationCount('loading')
      return
    }
    if (countData?.applicationList) {
      setApplicationCount(countData.applicationList.totalCount)
    }
  }, [loadingCount, countData])

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
