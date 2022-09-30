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

interface NumberRange {
  lowerBound?: number
  upperBound?: number
}

type InputError = {
  [Property in keyof NumberRange]?: boolean
}

const getCurrentValue = (numberRangeString?: string): NumberRange => {
  if (!numberRangeString) return {}
  const currentValue: NumberRange = {}
  const [lower, higher] = numberRangeString.split(':')
  if (lower !== '') currentValue.lowerBound = Number(lower)
  if (higher !== '') currentValue.upperBound = Number(higher)
  return currentValue
}

export const DataViewNumberFilter: React.FC<any> = ({
  setFilterText,
  title,
  numberRangeString,
  onRemove,
}) => {
  const { strings } = useLanguageProvider()
  const [numberRange, setNumberRange] = useState<NumberRange>(getCurrentValue(numberRangeString))
  const [lowerInput, setLowerInput] = useState(numberRange.lowerBound ?? '')
  const [upperInput, setUpperInput] = useState(numberRange.upperBound ?? '')
  const [inputError, setInputError] = useState<InputError>({})
  const [debounceOutput, setDebounceInput] = useDebounce('')

  const { lowerBound, upperBound } = numberRange

  useEffect(() => {
    if (lowerBound === undefined && upperBound === undefined) {
      setFilterText('')
      return
    }
    setFilterText(`${lowerBound ?? ''}:${upperBound ?? ''}`)
  }, [debounceOutput])

  const isValid = (input: string) => {
    return /^[0-9,]*$/.test(input)
  }

  const handleChange = async (input: string, type: keyof NumberRange) => {
    switch (type) {
      case 'lowerBound':
        setLowerInput(input)
        break
      case 'upperBound':
        setUpperInput(input)
        break
    }

    if (isValid(input)) {
      setInputError({ ...inputError, [type]: false })
      setNumberRange({
        ...numberRange,
        [type]: input !== '' ? Number(input.replace(/,/g, '')) : undefined,
      })
      setDebounceInput(input)
    } else setInputError({ ...inputError, [type]: true })
  }

  const segmentStyle = { gap: 10, margin: 0 }
  const inputStyle = { maxWidth: 100 }

  return (
    <FilterContainer title={title} onRemove={onRemove}>
      <Segment basic className="flex-row-space-between-center" style={segmentStyle}>
        <p className="no-margin-no-padding">{strings.DATA_VIEW_FILTER_HIGHER}</p>
        <Input
          size="small"
          className="search"
          onClick={(e: any) => e.stopPropagation()}
          onChange={(_, { value }) => handleChange(value, 'lowerBound')}
          value={lowerInput}
          error={inputError.lowerBound}
          style={inputStyle}
        />
      </Segment>
      <Segment basic className="flex-row-space-between-center" style={segmentStyle}>
        <p className="no-margin-no-padding">{strings.DATA_VIEW_FILTER_LOWER}</p>
        <Input
          size="small"
          className="search"
          onClick={(e: any) => e.stopPropagation()}
          onChange={(_, { value }) => handleChange(value, 'upperBound')}
          value={upperInput}
          error={inputError.upperBound}
          style={inputStyle}
        />
      </Segment>
    </FilterContainer>
  )
}
