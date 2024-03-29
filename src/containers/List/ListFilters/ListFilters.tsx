import React, { useEffect, useState } from 'react'
import { Dropdown, Icon } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { useRouter } from '../../../utils/hooks/useRouter'
import { FilterDefinitions } from '../../../utils/types'
import BooleanFilter from './BooleanFilter'
import { startCase } from './common'
import DateFilter from './DateFilter/DateFilter'
import { EnumFilter, SearchableListFilter, StaticListFilter } from './OptionFilters'
import {
  DataViewSearchableList,
  DataViewTextSearchFilter,
  DataViewNumberFilter,
} from '../../DataDisplay/Filters'
import { FilterIconMapping, GetMethodsForOptionFilter } from './types'
import { removeCommas } from '../../../utils/helpers/utilityFunctions'

const getArrayFromString = (string: string = '') =>
  string.split(',').filter((option) => !!option.trim())

const getDisplayableFilters = (filterDefinitions: FilterDefinitions) => {
  const result: FilterDefinitions = {}
  Object.entries(filterDefinitions).forEach(([filterName, filterValue]) => {
    // Missing title determines if filters should be shown in UI or not
    if (!filterValue.title) return
    result[filterName] = filterValue
  })

  return result
}

const getDefaultDisplayFilters = (filterDefinitions: FilterDefinitions) =>
  Object.entries(filterDefinitions)
    .filter(([_, filterValue]) => filterValue.default)
    .map(([filterName, _]) => filterName)

const ListFilters: React.FC<{
  filterDefinitions: FilterDefinitions
  filterListParameters: any
  defaultFilterString?: string | null
  totalCount: number | null
}> = ({ filterDefinitions, filterListParameters, defaultFilterString, totalCount = null }) => {
  const { t } = useLanguageProvider()
  const { query, updateQuery, location, setQuery } = useRouter()

  const displayableFilters = getDisplayableFilters(filterDefinitions)
  const defaultDisplayFilters = getDefaultDisplayFilters(filterDefinitions)

  const filterNames = Object.keys(displayableFilters)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // Add filters from URL to activeFilters, filters may not have criteria/options yet thus we have to use activeFilter state variable
  useEffect(() => {
    // Reset active filters if coming from Database menu selection
    if (location?.state?.resetFilters && location.search === '') {
      setActiveFilters([])
      return
    }

    const filtersInQuery = filterNames.filter((filterName) => !!query[filterName])
    const newFilters = filtersInQuery.filter((filterName) => !activeFilters.includes(filterName))
    if (activeFilters.length === 0 && newFilters.length === 0)
      setActiveFilters(defaultDisplayFilters)
    else setActiveFilters([...activeFilters, ...newFilters])
  }, [query, filterDefinitions])

  // Filter criteria/options states is provided by query URL, methods below are get and set query filter criteria
  const getMethodsForOptionFilter: GetMethodsForOptionFilter = (filterName) => ({
    getActiveOptions: () => getArrayFromString(query[filterName]),
    setActiveOption: (option: string) => {
      updateQuery({
        [filterName]: [...getArrayFromString(query[filterName]), removeCommas(option)].join(','),
      })
    },
    setInactiveOption: (option: string) =>
      updateQuery({
        [filterName]: getArrayFromString(query[filterName])
          .filter((_option) => startCase(_option) !== startCase(option))
          .join(','),
      }),
  })

  const addFilter = (filterName: string) => setActiveFilters([...activeFilters, filterName])
  const getOnRemove = (filterName: string) => () => {
    setActiveFilters(activeFilters.filter((_filterName) => _filterName !== filterName))
    updateQuery({
      [filterName]: undefined,
    })
  }

  const resetFilters = () => {
    setActiveFilters(defaultDisplayFilters)
    setQuery(defaultFilterString)
  }

  const availableFilterNames = filterNames.filter(
    (filterName) => !activeFilters.includes(filterName)
  )

  const renderTitle = () => (
    <div className="list-filter-title">
      <Icon name="plus" size="tiny" color="blue" />
      {t('FILTER_ADD_FILTER')}
    </div>
  )

  return (
    <div className="list-filter-container">
      <Dropdown trigger={renderTitle()} icon={null}>
        <Dropdown.Menu>
          {availableFilterNames.map((filterName) => (
            <Dropdown.Item key={filterName} onClick={() => addFilter(filterName)}>
              <Icon
                size="small"
                color="grey"
                name={iconMapping[displayableFilters[filterName].type] || 'list alternate outline'}
              />
              {displayableFilters[filterName].title}
            </Dropdown.Item>
          ))}
          {!!activeFilters.length && (
            <Dropdown.Item key="clear-filters" onClick={resetFilters}>
              <Icon size="small" color="grey" name="delete" />
              {t('FILTER_RESET_ALL')}
            </Dropdown.Item>
          )}
          {query.sortBy && (
            <Dropdown.Item key="clear-sort" onClick={() => updateQuery({ sortBy: null })}>
              <Icon size="small" color="grey" name="delete" />
              {t('FILTER_RESET_SORT')}
            </Dropdown.Item>
          )}
          {(query.page || query.perPage) && (
            <Dropdown.Item
              key="clear-pagination"
              onClick={() => updateQuery({ page: null, perPage: null })}
            >
              <Icon size="small" color="grey" name="delete" />
              {t('FILTER_RESET_PAGINATION')}
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
      {activeFilters.map((filterName) => {
        const filter = displayableFilters[filterName]
        if (!filter?.title) return null

        switch (filter.type) {
          case 'enumList':
            if (!filter?.options?.enumList) return null
            return (
              <EnumFilter
                key={filterName}
                title={filter.title}
                enumList={filter.options?.enumList}
                onRemove={getOnRemove(filterName)}
                {...getMethodsForOptionFilter(filterName)}
              />
            )
          case 'searchableListIn':
          case 'searchableListInArray':
            if (!filter?.options?.getListQuery) return null
            return (
              <SearchableListFilter
                key={filterName}
                title={filter.title}
                filterListParameters={filterListParameters}
                getFilterListQuery={filter.options?.getListQuery}
                {...getMethodsForOptionFilter(filterName)}
                onRemove={getOnRemove(filterName)}
              />
            )

          case 'staticList':
            if (!filter?.options?.getListQuery) return null

            return (
              <StaticListFilter
                key={filterName}
                title={filter.title}
                filterListParameters={filterListParameters}
                getFilterListQuery={filter.options?.getListQuery}
                {...getMethodsForOptionFilter(filterName)}
                onRemove={getOnRemove(filterName)}
              />
            )

          case 'boolean':
            if (!filter?.options?.booleanMapping) return null

            return (
              <BooleanFilter
                key={filterName}
                title={filter.title}
                onRemove={getOnRemove(filterName)}
                activeOptions={getArrayFromString(query[filterName])}
                booleanMapping={filter?.options?.booleanMapping}
                toggleFilter={(value: boolean) =>
                  updateQuery({
                    [filterName]: String(value),
                  })
                }
              />
            )

          case 'date':
            return (
              <DateFilter
                key={filterName}
                title={filter.title}
                namedDates={filter.options?.namedDates}
                dateString={query[filterName]}
                onRemove={getOnRemove(filterName)}
                setDateString={(dateFilter: string) => {
                  updateQuery({
                    [filterName]: dateFilter,
                  })
                }}
              />
            )
          case 'number':
            return (
              <DataViewNumberFilter
                key={filterName}
                title={filter.title}
                setFilterText={(text: string) => updateQuery({ [filterName]: text })}
                numberRangeString={query[filterName]}
                onRemove={getOnRemove(filterName)}
              />
            )
          case 'dataViewBoolean':
            return (
              <BooleanFilter
                key={filterName}
                title={filter.title}
                onRemove={getOnRemove(filterName)}
                activeOptions={getArrayFromString(query[filterName])}
                booleanMapping={
                  filter?.options?.booleanMapping ?? {
                    true: t('DATA_VIEW_FILTER_TRUE'),
                    false: t('DATA_VIEW_FILTER_FALSE'),
                  }
                }
                toggleFilter={(value: boolean) =>
                  updateQuery({
                    [filterName]: String(value),
                  })
                }
              />
            )
          case 'dataViewString':
            return filter.options?.showFilterList ? (
              <DataViewSearchableList
                key={filterName}
                title={filter.title}
                filterListParameters={filterListParameters}
                options={filter.options}
                {...getMethodsForOptionFilter(filterName)}
                onRemove={getOnRemove(filterName)}
              />
            ) : (
              <DataViewTextSearchFilter
                key={filterName}
                title={filter.title}
                currentValue={query[filterName] ?? ''}
                setFilterText={(text: string) => updateQuery({ [filterName]: text })}
                onRemove={getOnRemove(filterName)}
              />
            )
          default:
            return null
        }
      })}
      {totalCount !== null && (
        <p className="result-count">{t('APPLICATIONS_LIST_TOTAL_RESULTS', totalCount)}</p>
      )}
    </div>
  )
}

const iconMapping: FilterIconMapping = {
  staticList: 'list alternate outline',
  enumList: 'list alternate outline',
  searchableListIn: 'search',
  searchableListInArray: 'search',
  date: 'calendar alternate',
  boolean: 'toggle on',
  dataViewBoolean: 'toggle on',
  dataViewString: 'search',
  number: 'calculator',
}

export default ListFilters
