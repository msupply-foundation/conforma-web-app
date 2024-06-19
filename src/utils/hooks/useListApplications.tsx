import { useRouter } from '../hooks/useRouter'
import { usePrefs } from '../../contexts/SystemPrefs'
import buildFilter from '../helpers/list/buildQueryFilters'
import buildSortFields, { getPaginationVariables } from '../helpers/list/buildQueryVariables'
import {
  useGetApplicationListQuery,
  ApplicationListShapesOrderBy,
} from '../../utils/generated/graphql'
import { BasicStringObject } from '../types'
import { useUserState } from '../../contexts/UserState'
import { useGetFilterDefinitions } from '../helpers/list/useGetFilterDefinitions'

const useListApplications = (
  { sortBy, page, perPage, type, ...queryFilters }: BasicStringObject,
  graphQLFilterObject?: object
) => {
  const FILTER_DEFINITIONS = useGetFilterDefinitions()
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

  const { data, loading, refetch, error } = useGetApplicationListQuery({
    variables: {
      filters,
      sortFields,
      paginationOffset,
      numberToFetch,
      userId: currentUser?.userId as number,
      templateCode: type || '',
    },
    fetchPolicy: 'cache-and-network',
  })

  const applications = data?.applicationList?.nodes ?? []

  // If there is no records and we are not on first page, go to first page. This
  // happens when changing a filter results in a smaller result set than the
  // current page would reach.
  if (!loading && applications.length === 0 && pageNumber !== 1) {
    updateQuery({ page: 1 })
  }

  const templateType = data?.templates?.nodes?.[0]

  return {
    error: error?.message ?? '',
    // "loading" needs the data check, as it displays loading instead of cached
    // result when doing background network fetch (with "cache-and-network"
    // policy)
    loading: loading && !data,
    refetch,
    templateType,
    applications,
    applicationCount: data?.applicationList?.totalCount ?? null,
  }
}

export default useListApplications
