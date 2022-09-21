import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { Dropdown, Input } from 'semantic-ui-react'
import { EnumFilterProps, StaticListFilterProps, SearchableListFilterProps } from './types'
import { FilterContainer, FilterOptions } from './common'
import { useLanguageProvider } from '../../../contexts/Localisation'

const EnumFilter: React.FC<EnumFilterProps> = ({
  getActiveOptions,
  setActiveOption,
  setInactiveOption,
  enumList,
  title,
  onRemove,
}) => {
  const activeOptions = getActiveOptions()

  return (
    <FilterContainer selectedCount={activeOptions.length} title={title} onRemove={onRemove}>
      <FilterOptions
        setActiveOption={setActiveOption}
        setInactiveOption={setInactiveOption}
        activeOptions={activeOptions}
        optionList={enumList}
      />
    </FilterContainer>
  )
}

const StaticListFilter: React.FC<StaticListFilterProps> = ({
  getActiveOptions,
  setActiveOption,
  setInactiveOption,
  filterListParameters,
  getFilterListQuery,
  title,
  onRemove,
}) => {
  const { query, resultExtractor, variables } = getFilterListQuery({ filterListParameters })

  const { data, error } = useQuery(query, {
    fetchPolicy: 'network-only',
    variables,
  })

  if (error) return null

  const matchedOptions = resultExtractor(data).list

  return (
    <EnumFilter
      key={title}
      title={title}
      enumList={matchedOptions}
      onRemove={onRemove}
      getActiveOptions={getActiveOptions}
      setActiveOption={setActiveOption}
      setInactiveOption={setInactiveOption}
    />
  )
}

const SearchableListFilter: React.FC<SearchableListFilterProps> = ({
  getActiveOptions,
  setActiveOption,
  setInactiveOption,
  filterListParameters,
  getFilterListQuery,
  title,
  onRemove,
}) => {
  const { strings } = useLanguageProvider()
  const [searchValue, setSearchValue] = useState('')

  const { query, resultExtractor, variables } = getFilterListQuery({
    searchValue,
    filterListParameters,
  })

  const { data, error } = useQuery(query, {
    fetchPolicy: 'network-only',
    variables,
  })
  const activeOptions = getActiveOptions()
  let matchedOptions: string[] = []

  if (!error && data) matchedOptions = resultExtractor(data).list

  return (
    <FilterContainer selectedCount={activeOptions.length} title={title} onRemove={onRemove}>
      <Input
        icon="search"
        placeholder={strings.FILTER_START_TYPING}
        iconPosition="left"
        className="search"
        onClick={(e: any) => e.stopPropagation()}
        onChange={(_, { value }) => {
          setSearchValue(value)
        }}
      />
      <Dropdown.Divider />
      <FilterOptions
        setActiveOption={setActiveOption}
        setInactiveOption={setInactiveOption}
        activeOptions={activeOptions}
        optionList={matchedOptions}
      />
    </FilterContainer>
  )
}

const DataViewSearchableFilter: React.FC<any> = ({
  getActiveOptions,
  setActiveOption,
  setInactiveOption,
  getFilterList,
  title,
  onRemove,
}) => {
  const { strings } = useLanguageProvider()
  const [searchValue, setSearchValue] = useState('')
  const [filterList, setFilterList] = useState([])

  useEffect(() => {
    getFilterList().then((result: any) => setFilterList(result))
  }, [])

  const activeOptions = getActiveOptions()

  // To-do: Handle Error
  // if (!error && data) matchedOptions = resultExtractor(data).list

  return (
    <FilterContainer selectedCount={activeOptions.length} title={title} onRemove={onRemove}>
      <Input
        icon="search"
        placeholder={strings.FILTER_START_TYPING}
        iconPosition="left"
        className="search"
        onClick={(e: any) => e.stopPropagation()}
        onChange={(_, { value }) => {
          setSearchValue(value)
        }}
      />
      <Dropdown.Divider />
      <FilterOptions
        setActiveOption={setActiveOption}
        setInactiveOption={setInactiveOption}
        activeOptions={activeOptions}
        optionList={filterList.filter((item: string) =>
          new RegExp(searchValue.toLowerCase()).test(item.toLowerCase())
        )}
      />
    </FilterContainer>
  )
}

export { StaticListFilter, SearchableListFilter, EnumFilter, DataViewSearchableFilter }
