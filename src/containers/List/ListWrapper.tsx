import React, { useEffect, useState } from 'react'
import { Label, Button, Search, Header, Icon } from 'semantic-ui-react'

import { useRouter } from '../../utils/hooks/useRouter'
import usePageTitle from '../../utils/hooks/usePageTitle'
import useListApplications from '../../utils/hooks/useListApplications'
import { useLanguageProvider } from '../../contexts/Localisation'
import { findUserRole, checkExistingUserRole } from '../../utils/helpers/list/findUserRole'
import { useUserState } from '../../contexts/UserState'
import { useMapColumnsByRole } from '../../utils/helpers/list/mapColumnsByRole'
import { ApplicationListRow, ColumnDetails, SortQuery } from '../../utils/types'
import { USER_ROLES } from '../../utils/data'
import { Link } from 'react-router-dom'
import ApplicationsList from '../../components/List/ApplicationsList'
import PaginationBar from '../../components/List/Pagination'
import ListFilters from './ListFilters/ListFilters'
import { useGetFilterDefinitions } from '../../utils/helpers/list/useGetFilterDefinitions'
import useDebounce from '../../formElementPlugins/search/src/useDebounce'
import { TableMobileHeader } from '../../utils/tables/TableMobileHeader'
import { useViewport } from '../../contexts/ViewportState'

const ListWrapper: React.FC = () => {
  const { t } = useLanguageProvider()
  const FILTER_DEFINITIONS = useGetFilterDefinitions()
  const mapColumnsByRole = useMapColumnsByRole()
  const { query, updateQuery } = useRouter()
  const { type, userRole } = query
  const {
    userState: { templatePermissions, isNonRegistered, currentUser },
    logout,
  } = useUserState()
  const { isMobile } = useViewport()
  const [columns, setColumns] = useState<ColumnDetails[]>([])
  const [searchText, setSearchText] = useState<string>(query?.search)
  const [debounceOutput, setDebounceInput] = useDebounce<string>('')

  const [sortQuery, setSortQuery] = useState<SortQuery>(getInitialSortQuery(query?.sortBy))
  const [applicationsRows, setApplicationsRows] = useState<ApplicationListRow[]>([])
  usePageTitle(t('PAGE_TITLE_LIST') as string)

  if (isNonRegistered) {
    logout()
    return null
  }

  const { error, loading, refetch, templateType, applications, applicationCount } =
    useListApplications(query)

  useEffect(() => {
    if (!templatePermissions) return
    if (!type || !userRole || !checkExistingUserRole(templatePermissions, type, userRole))
      redirectToDefault()
    else {
      const columns = mapColumnsByRole(userRole as USER_ROLES)
      setColumns(columns)
    }
  }, [query, templatePermissions])

  useEffect(() => {
    if (!loading && applications) {
      setApplicationsRows(
        applications.map((application) => ({ ...application, isExpanded: false }))
      )
    }
  }, [loading, applications])

  useEffect(() => {
    if (searchText !== undefined) updateQuery({ search: searchText })
  }, [debounceOutput])

  useEffect(() => {
    const { sortColumn, sortDirection } = sortQuery
    if (Object.keys(sortQuery).length > 0)
      updateQuery({
        sortBy: sortColumn
          ? `${sortColumn}${sortDirection === 'ascending' ? ':asc' : ''}`
          : undefined,
      })
  }, [sortQuery])

  const redirectToDefault = () => {
    const redirectType = type || Object.keys(templatePermissions)[0]
    const redirectUserRole = checkExistingUserRole(templatePermissions, redirectType, userRole)
      ? userRole
      : findUserRole(templatePermissions, redirectType)
    if (redirectType && redirectUserRole) {
      updateQuery({ type: redirectType, userRole: redirectUserRole }, true)
    } else {
      // To-Do: Show 404 if no default found
    }
  }

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value)
    setDebounceInput(e.target.value)
  }

  const handleSort = (sortName: string) => {
    const { sortColumn, sortDirection } = sortQuery

    if (sortColumn === '') {
      console.log('Column not sortable')
      return
    }

    if (sortName === sortColumn) {
      setSortQuery({
        sortColumn,
        sortDirection: sortDirection === 'ascending' ? 'descending' : 'ascending',
      })
      return
    }

    setSortQuery({ sortColumn: sortName })
  }

  const visibleFilters = Object.fromEntries(
    Object.entries(FILTER_DEFINITIONS).filter(([_, { visibleTo }]) =>
      visibleTo.includes(userRole as USER_ROLES)
    )
  )

  return error ? (
    <Label content={t('ERROR_APPLICATIONS_LIST')} error={error} />
  ) : (
    <div id="list-container">
      <div id="list-top">
        <Header as="h2">{templateType?.name ?? t('PAGE_TITLE_LIST')}</Header>
        <Search
          className="flex-grow-1"
          // size="large"
          placeholder={t('PLACEHOLDER_SEARCH')}
          onSearchChange={handleSearchChange}
          input={{ icon: 'search', iconPosition: 'left' }}
          open={false}
          value={searchText}
        />
        {query.userRole === 'applicant' ? (
          <Button as={Link} to={`/application/new?type=${type}`} inverted color="blue">
            <Icon name="plus" size="tiny" color="blue" />
            {t('BUTTON_APPLICATION_NEW')}
          </Button>
        ) : null}
      </div>
      <div className="flex-column" style={{ gap: 5 }}>
        <ListFilters
          filterDefinitions={visibleFilters}
          filterListParameters={{ userId: currentUser?.userId || 0, templateCode: type }}
          totalCount={applicationCount}
        />
        {isMobile && (
          <TableMobileHeader
            options={columns
              .filter((col) => col.sortName !== '')
              .map((col) => ({
                key: col.sortName,
                text: col.headerName || col.sortName,
                value: col.sortName,
              }))}
            sortColumn={sortQuery.sortColumn}
            sortDirection={sortQuery.sortDirection}
            handleSort={handleSort}
            defaultSort="last-active-date"
          />
        )}
      </div>
      {columns && (
        <ApplicationsList
          columns={columns}
          applications={applicationsRows}
          sortQuery={sortQuery}
          handleSort={handleSort}
          loading={loading}
          refetch={refetch}
        />
      )}
      {applicationCount !== null && <PaginationBar totalCount={applicationCount} translate={t} />}
    </div>
  )
}

export default ListWrapper

const getInitialSortQuery = (query: string): SortQuery => {
  if (!query) return {}
  const [sortColumn, direction] = query.split(':')
  return {
    sortColumn,
    sortDirection: direction === 'asc' ? 'ascending' : 'descending',
  }
}
