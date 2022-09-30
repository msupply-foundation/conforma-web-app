/*
These filters are based on the Application List filters. The main difference is
their methods for querying the database
*/

import React, { useState, useEffect } from 'react'
import { Dropdown, Input, Segment } from 'semantic-ui-react'
import { FilterContainer, FilterOptions } from '../List/ListFilters/common'
import { useLanguageProvider } from '../../contexts/Localisation'
import getServerUrl from '../../utils/helpers/endpoints/endpointUrlBuilder'
import { postRequest } from '../../utils/helpers/fetchMethods'
import useDebounce from '../../formElementPlugins/search/src/useDebounce'

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

  const { column, code, searchFields, delimiter } = options

  useEffect(() => {
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

export const DataViewTextSearchFilter: React.FC<any> = ({
  setFilterText,
  title,
  onRemove,
  currentValue,
}) => {
  const { strings } = useLanguageProvider()
  const [searchText, setSearchText] = useState<string>(currentValue)
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
        value={searchText}
        onClick={(e: any) => e.stopPropagation()}
        onChange={(_, { value }) => {
          setSearchText(value)
          setDebounceInput(value)
        }}
      />
    </FilterContainer>
  )
}

export const DataViewNumberFilter: React.FC<any> = ({ setFilterText, title, onRemove }) => {
  const { strings } = useLanguageProvider()
  const [lowerBound, setLowerBound] = useState<number>()
  const [upperBound, setUPperBound] = useState<number>()
  const [debounceOutput, setDebounceInput] = useDebounce<number | null>(null)

  useEffect(() => {
    setFilterText(debounceOutput)
  }, [debounceOutput])

  return (
    <FilterContainer title={title} onRemove={onRemove}>
      <Segment basic className="flex-row">
        <p>Higher than:</p>
        <Input
          type="number"
          // placeholder={strings.FILTER_START_TYPING}
          size="small"
          className="search"
          onClick={(e: any) => e.stopPropagation()}
          onChange={(_, { value }) => {
            setLowerBound(Number(value))
            setDebounceInput(Number(value))
          }}
        />
      </Segment>
      <Segment basic className="flex-row">
        <p>Lower than:</p>
        <Input
          type="number"
          // placeholder={strings.FILTER_START_TYPING}
          size="small"
          className="search"
          onClick={(e: any) => e.stopPropagation()}
          onChange={(_, { value }) => {
            setUPperBound(Number(value))
            setDebounceInput(Number(value))
          }}
        />
      </Segment>
    </FilterContainer>
  )
}
