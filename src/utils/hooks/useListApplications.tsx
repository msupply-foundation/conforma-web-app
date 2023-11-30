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
  // Manually keep track of loading state, due to interval between loading application
  // and loading counts that causes flicker
  const [isLoadingCount, setIsLoadingCount] = useState(true)
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

  const pageNumber = page ? Number(page) : 1
  const { paginationOffset, numberToFetch } = getPaginationVariables(
    pageNumber,
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

  const [getListCount, { data: countData }] = useGetFilteredApplicationCountLazyQuery({
    fetchPolicy: 'network-only',
    onCompleted: () => setIsLoadingCount(false),
  })

  useEffect(() => {
    if (loading) {
      setIsLoadingCount(true)
      return
    }

    if (applicationsError) {
      setError(applicationsError.message)
      return
    }

    if (data?.templates?.nodes && data?.templates?.nodes.length > 0) {
      const { code, name, namePlural } = data?.templates?.nodes?.[0] as TemplateType
      setTemplateType({ code, name, namePlural })
    }

    if (data?.applicationList) {
      const applicationsList = data?.applicationList?.nodes
      setApplications(applicationsList as ApplicationListShape[])
      // If there is no records and we are not on first page, go to first page
      // This happens when filter is changed while not on first page
      // May cause a small period where 'no applications' appears, but that should be quick
      // And small compromise for the simplicity
      if (applicationsList.length === 0 && pageNumber !== 1) {
        updateQuery({ page: 1 })
      } else {
        getListCount({
          variables: { filter: filters, userId: currentUser?.userId as number },
        })
      }
    }
  }, [applicationsError, loading])

  return {
    error,
    loading,
    refetch,
    templateType,
    applications,
    applicationCount: !isLoadingCount ? countData?.applicationList?.totalCount ?? null : null,
  }
}

export default useListApplications
