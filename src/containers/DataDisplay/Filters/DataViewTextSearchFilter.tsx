/*
This filter is based on the Application List filter <SearchableListFilter>. The
main difference is the method for querying the database
*/

import React, { useState, useEffect } from 'react'
import { Input } from 'semantic-ui-react'
import { FilterContainer } from '../../List/ListFilters/common'
import { useLanguageProvider } from '../../../contexts/Localisation'
import useDebounce from '../../../formElementPlugins/search/src/useDebounce'

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
