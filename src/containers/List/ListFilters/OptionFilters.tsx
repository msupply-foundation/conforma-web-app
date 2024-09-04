import React from 'react'
import { useQuery } from '@apollo/client'
import { Dropdown, Input } from 'semantic-ui-react'
import { EnumFilterProps, StaticListFilterProps, SearchableListFilterProps } from './types'
import { FilterContainer, FilterOptions, FilterTitle } from './common'
import { useLanguageProvider } from '../../../contexts/Localisation'
import useDebounce from '../../../formElementPlugins/search/src/useDebounce'

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
    <FilterContainer
      label={activeOptions.length || ''}
      title={title}
      onRemove={onRemove}
      trigger={<FilterTitle title={title ?? ''} />}
    >
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
    fetchPolicy: 'cache-first',
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
  const { t } = useLanguageProvider()
  const [searchValue, setSearchValue] = useDebounce('')

  const { query, resultExtractor, variables } = getFilterListQuery({
    searchValue,
    filterListParameters,
  })

  const { data, error } = useQuery(query, {
    fetchPolicy: 'cache-first',
    variables,
  })
  const activeOptions = getActiveOptions()
  let matchedOptions: string[] = []

  if (!error && data) matchedOptions = resultExtractor(data).list

  return (
    <FilterContainer
      label={activeOptions.length || ''}
      title={title}
      onRemove={onRemove}
      trigger={<FilterTitle title={title ?? ''} />}
    >
      <Input
        icon="search"
        placeholder={t('FILTER_SEARCH_LIST')}
        iconPosition="left"
        className="search"
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

export { StaticListFilter, SearchableListFilter, EnumFilter }
