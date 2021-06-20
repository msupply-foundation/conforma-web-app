import React, { useEffect, useState } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { useRouter } from '../../../utils/hooks/useRouter'
import { FilterDefinitions } from '../../../utils/types'
import BooleanFilter from './BooleanFilter'
import { EnumFilter, SearchableListFilter, StaticListFilter } from './OptionFilters'
import { GetMethodsForOptionFilter } from './types'

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

const ListFilters: React.FC<{ filterDefinitions: FilterDefinitions; filterListParameters: any }> =
  ({ filterDefinitions, filterListParameters }) => {
    const { query, updateQuery } = useRouter()

    const displayableFilters = getDisplayableFilters(filterDefinitions)

    const filterNames = Object.keys(displayableFilters)
    const [activeFilters, setActiveFilters] = useState<string[]>([])

    // Add fitlers from URL to activeFilters, filters may not have criteria/options yet thus we have to use activeFilter state variable
    useEffect(() => {
      const filersInQuery = filterNames.filter((filterName) => !!query[filterName])
      const newFilters = filersInQuery.filter((filterName) => !activeFilters.includes(filterName))
      setActiveFilters([...activeFilters, ...newFilters])
    }, [query])

    // Filter criteria/options states is provided by query URL, methods below are get and set query fiter criteria
    const getMethodsForOptionFilter: GetMethodsForOptionFilter = (filterName) => ({
      getActiveOptions: () => getArrayFromString(query[filterName]),
      setActiveOption: (option: string) =>
        updateQuery({ [filterName]: [...getArrayFromString(query[filterName]), option].join(',') }),
      setInactiveOption: (option: string) =>
        updateQuery({
          [filterName]: getArrayFromString(query[filterName])
            .filter((_option) => _option != option)
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

    const availableFilterNames = filterNames.filter(
      (filterName) => !activeFilters.includes(filterName)
    )

    return (
      <div id="list-filter">
        <Dropdown text="+ Filter" icon={null}>
          <Dropdown.Menu>
            {availableFilterNames.map((filterName) => (
              <Dropdown.Item key={filterName} onClick={() => addFilter(filterName)}>
                {displayableFilters[filterName].title}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        {activeFilters.map((filterName) => {
          const filter = displayableFilters[filterName]
          if (!filter.title) return null

          if (filter.type === 'enumList') {
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
          }

          if (filter.type === 'searchableListIn' || filter.type === 'searchableListInArray') {
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
          }

          if (filter.type === 'staticList') {
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
          }

          if (filter.type === 'boolean') {
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
          }
          return null
        })}
      </div>
    )
  }

export default ListFilters
