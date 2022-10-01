/*
This filter is based on the Application List filter <SearchableListFilter>. The
main difference is the method for querying the database
*/

import React, { useState, useEffect } from 'react'
import { Dropdown, Input } from 'semantic-ui-react'
import { FilterContainer, FilterOptions } from '../../List/ListFilters/common'
import { useLanguageProvider } from '../../../contexts/Localisation'
import getServerUrl from '../../../utils/helpers/endpoints/endpointUrlBuilder'
import { postRequest } from '../../../utils/helpers/fetchMethods'
import useDebounce from '../../../formElementPlugins/search/src/useDebounce'
import { SearchableListFilterProps } from '../../List/ListFilters/types'
import { FilterTypeOptions } from '../../../utils/types'

type SearchableListProps = Omit<SearchableListFilterProps, 'getFilterListQuery'> & {
  options: FilterTypeOptions
}

export const DataViewSearchableList: React.FC<SearchableListProps> = ({
  getActiveOptions,
  setActiveOption,
  setInactiveOption,
  options,
  title,
  onRemove,
}) => {
  const { strings } = useLanguageProvider()
  const [searchText, setSearchText] = useState<any>()
  const [filterList, setFilterList] = useState<string[]>()
  const [error, setError] = useState<string>()
  const [moreResults, setMoreResults] = useState(false)
  const [debounceOutput, setDebounceInput] = useDebounce(searchText)

  const { column, code, searchFields, delimiter } = options

  useEffect(() => {
    if (!code || !column) return
    postRequest({
      url: getServerUrl('dataViews', { dataViewCode: code, column }),
      jsonBody: { searchText, searchFields, delimiter },
      headers: { 'Content-Type': 'application/json' },
    }).then(({ list, moreResultsAvailable, error, message }) => {
      if (error) {
        setError(message)
      } else {
        setFilterList(list.map((val: string | null) => (val === null ? options.nullString : val)))
        setMoreResults(moreResultsAvailable)
      }
    })
  }, [debounceOutput])

  const activeOptions = getActiveOptions()

  return (
    <FilterContainer selectedCount={activeOptions.length} title={title} onRemove={onRemove}>
      {!error && filterList ? (
        <>
          <Input
            icon="search"
            placeholder={strings.FILTER_START_TYPING}
            iconPosition="left"
            className="search"
            onClick={(e: any) => e.stopPropagation()}
            onChange={(_, { value }) => {
              setSearchText(value)
              setDebounceInput(value)
            }}
          />
          <Dropdown.Divider />
          <FilterOptions
            setActiveOption={setActiveOption}
            setInactiveOption={setInactiveOption}
            activeOptions={activeOptions}
            optionList={filterList || []}
          />
          {moreResults && <FilterListInfo message={strings.DATA_VIEW_FILTER_MORE_RESULTS} />}
        </>
      ) : (
        <FilterListInfo
          message={error ? error : strings.DATA_VIEW_FILTER_LIST_LOADING}
          error={!!error}
        />
      )}
    </FilterContainer>
  )
}

const FilterListInfo: React.FC<{ message: string; error?: boolean }> = ({ message, error }) => {
  return (
    <div className={`flex-row-center-center filter-list-message${error ? ' alert-colour' : ''}`}>
      <p className="slightly-smaller-text ">
        <em>{message}</em>
      </p>
    </div>
  )
}
