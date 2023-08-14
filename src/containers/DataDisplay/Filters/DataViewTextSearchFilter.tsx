/*
This filter is based <DataViewSearchableList>, but without the List part
*/

import React, { useState, useEffect, useRef } from 'react'
import { Input } from 'semantic-ui-react'
import { FilterContainer, FilterTitle } from '../../List/ListFilters/common'
import { useLanguageProvider } from '../../../contexts/Localisation'
import useDebounce from '../../../formElementPlugins/search/src/useDebounce'
import { FiltersCommon } from '../../List/ListFilters/types'
import { truncateString } from '../../../utils/helpers/utilityFunctions'

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
  const { t } = useLanguageProvider()
  const [searchText, setSearchText] = useState<string>(currentValue)
  const [debounceOutput, setDebounceInput] = useDebounce(searchText)

  const inputRef = useRef<Input>(null)

  useEffect(() => {
    setFilterText(debounceOutput)
  }, [debounceOutput])

  return (
    <FilterContainer
      title={title}
      onRemove={onRemove}
      trigger={
        <FilterTitle
          title={title ?? ''}
          criteria={truncateString(searchText, 15)}
          icon={searchText ? 'search' : undefined}
        />
      }
      setFocus={() => {
        if (inputRef.current !== null) setTimeout(inputRef.current.focus, 100)
      }}
    >
      <Input
        ref={inputRef}
        icon="search"
        placeholder={t('FILTER_START_TYPING')}
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
