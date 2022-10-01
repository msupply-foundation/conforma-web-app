/*
This filter is based <DataViewSearchableList>, but without the List part
*/

import React, { useState, useEffect, useRef } from 'react'
import { Input, Form } from 'semantic-ui-react'
import { FilterContainer, FilterTitle } from '../../List/ListFilters/common'
import { useLanguageProvider } from '../../../contexts/Localisation'
import useDebounce from '../../../formElementPlugins/search/src/useDebounce'
import { FiltersCommon } from '../../List/ListFilters/types'

type TextSearchFilterProps = FiltersCommon & {
  setFilterText: (text: string) => void
  currentValue: string
}

export const DataViewTextSearchFilter: React.FC<TextSearchFilterProps> = ({
  setFilterText,
  title,
  onRemove,
  currentValue,
}) => {
  const { strings } = useLanguageProvider()
  const [searchText, setSearchText] = useState<string>(currentValue)
  const [debounceOutput, setDebounceInput] = useDebounce(searchText)

  const inputRef = useRef(null)

  useEffect(() => {
    setFilterText(debounceOutput)
  }, [debounceOutput])

  return (
    <FilterContainer
      title={title}
      onRemove={onRemove}
      replacementTrigger={
        <FilterTitle
          title={title ?? ''}
          criteria={searchText}
          icon={searchText ? 'search' : undefined}
        />
      }
      setFocus={() => setTimeout((inputRef as any).current.focus, 100)}
    >
      <Input
        ref={inputRef}
        icon="search"
        placeholder={strings.FILTER_START_TYPING}
        iconPosition="left"
        className="search"
        value={searchText}
        onChange={(_, { value }) => {
          setSearchText(value)
          setDebounceInput(value)
        }}
      />
    </FilterContainer>
  )
}
