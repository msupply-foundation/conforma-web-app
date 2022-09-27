/*
These filters are based on the Application List filters. The main difference is
their methods for querying the database
*/

import React, { useState, useEffect } from 'react'
import { Checkbox, Dropdown, Input } from 'semantic-ui-react'
import { FilterContainer, FilterOptions } from '../List/ListFilters/common'
import { useLanguageProvider } from '../../contexts/Localisation'
import getServerUrl from '../../utils/helpers/endpoints/endpointUrlBuilder'
import { postRequest } from '../../utils/helpers/fetchMethods'
import useDebounce from '../../formElementPlugins/search/src/useDebounce'
import { BooleanFilterProps } from '../List/ListFilters/types'

export const DataViewSearchableList: React.FC<any> = ({
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

  const { column, code, dataType, showFilterList, searchFields, delimiter, valueMap } = options

  useEffect(() => {
    postRequest({
      url: getServerUrl('dataViews', { dataViewCode: code, column }),
      jsonBody: { searchText, searchFields, delimiter, valueMap },
      headers: { 'Content-Type': 'application/json' },
    }).then(({ list, moreResultsAvailable, error, message }) => {
      if (error) {
        setError(message)
      } else {
        setFilterList(list)
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
          {showFilterList && (
            <FilterOptions
              setActiveOption={setActiveOption}
              setInactiveOption={setInactiveOption}
              activeOptions={activeOptions}
              optionList={filterList || []}
            />
          )}
          {showFilterList && moreResults && (
            <FilterListInfo message={strings.DATA_VIEW_FILTER_MORE_RESULTS} />
          )}
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
      <p>
        <em>{message}</em>
      </p>
    </div>
  )
}

export const DataViewTextSearchFilter: React.FC<any> = ({ setFilterText, title, onRemove }) => {
  const { strings } = useLanguageProvider()
  const [searchText, setSearchText] = useState<any>()
  const [debounceOutput, setDebounceInput] = useDebounce(searchText)

  useEffect(() => {
    setFilterText(debounceOutput)
  }, [debounceOutput])

  return (
    <FilterContainer title={title} onRemove={onRemove}>
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
    </FilterContainer>
  )
}
