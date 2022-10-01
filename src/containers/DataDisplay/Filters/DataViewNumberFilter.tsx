/*
Filter uses existing filter-handling and building logic from Application List
filters
*/

import React, { useState, useEffect } from 'react'
import { Input, Segment } from 'semantic-ui-react'
import { FilterContainer } from '../../List/ListFilters/common'
import { useLanguageProvider } from '../../../contexts/Localisation'
import useDebounce from '../../../formElementPlugins/search/src/useDebounce'
import { FiltersCommon } from '../../List/ListFilters/types'

type NumberFilterProps = FiltersCommon & {
  setFilterText: (text: string) => void
  numberRangeString: string
}

export const DataViewNumberFilter: React.FC<NumberFilterProps> = ({
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
