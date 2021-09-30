import { useEffect, useState } from 'react'
import { useRouter } from '../hooks/useRouter'
import buildFilter from '../helpers/list/buildQueryFilters'
import buildSortFields, { getPaginationVariables } from '../helpers/list/buildQueryVariables'
import { useGetApplicationListQuery, ApplicationListShape } from '../../utils/generated/graphql'
import { BasicStringObject } from '../types'
import { useUserState } from '../../contexts/UserState'
import { useApplicationFilters } from '../data/applicationFilters'
import { useLanguageProvider } from '../../contexts/Localisation'
import translate from '../helpers/structure/replaceLocalisedStrings'

const useListApplications = ({ sortBy, page, perPage, ...queryFilters }: BasicStringObject) => {
  const { selectedLanguage } = useLanguageProvider()
  const APPLICATION_FILTERS = useApplicationFilters()
  const [applications, setApplications] = useState<ApplicationListShape[]>([])
  const [applicationCount, setApplicationCount] = useState<number>(0)
  const [error, setError] = useState('')
  const { updateQuery } = useRouter()
  const {
    userState: { currentUser },
  } = useUserState()

  const filters = buildFilter(queryFilters, APPLICATION_FILTERS)
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
      languageCode: selectedLanguage.code,
    },
    fetchPolicy: 'network-only',
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
      const applicationsList = (data?.applicationList?.nodes).map((application) =>
        translate(application, application?.languageStrings)
      )
      setApplications(applicationsList as ApplicationListShape[])
      setApplicationCount(data?.applicationList?.totalCount)
    }
  }, [data, applicationsError])

  return {
    error,
    loading,
    refetch,
    applications,
    applicationCount,
  }
}

export default useListApplications
