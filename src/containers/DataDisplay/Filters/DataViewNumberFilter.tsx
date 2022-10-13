/*
Filter uses existing filter-handling and building logic from Application List
filters
*/

import React, { useState, useEffect, useRef } from 'react'
import { Input, Segment, Form } from 'semantic-ui-react'
import { FilterContainer, FilterTitle } from '../../List/ListFilters/common'
import { useLanguageProvider } from '../../../contexts/Localisation'
import useDebounce from '../../../formElementPlugins/search/src/useDebounce'
import { FiltersCommon } from '../../List/ListFilters/types'
import { isUndefined } from 'lodash'

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
  const [debounceOutput, setDebounceInput] = useDebounce(0)

  const { lowerBound, upperBound } = numberRange

  useEffect(() => {
    if (isUndefined(lowerBound) && isUndefined(upperBound)) {
      setFilterText('')
      return
    }
    setFilterText(`${lowerBound ?? ''}:${upperBound ?? ''}`)
  }, [debounceOutput])

  const isValid = (input: string) => {
    // Digits, commas, and an optional negative sign at the start
    // Commas are stripped before converting to number
    return /^-?[0-9,]*$/.test(input)
  }

  const getRangeAsText = (): string => {
    const lower = !isUndefined(lowerBound)
    const upper = !isUndefined(upperBound)
    if (lower && upper) return `${lowerBound} – ${upperBound}`
    if (lower) return `${strings.DATA_VIEW_FILTER_HIGHER.replace(':', '')} ${lowerBound}`
    if (upper) return `${strings.DATA_VIEW_FILTER_LOWER.replace(':', '')} ${upperBound}`
    return ''
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
      setDebounceInput(Math.random())
    } else setInputError({ ...inputError, [type]: true })
  }

  const segmentStyle = { gap: 10, margin: 0 }
  const inputStyle = { maxWidth: 100 }

  const inputRef = useRef<Input>(null)

  return (
    <FilterContainer
      title={title}
      onRemove={onRemove}
      trigger={
        <FilterTitle
          title={title ?? ''}
          criteria={getRangeAsText()}
          icon={!isUndefined(lowerBound) || !isUndefined(upperBound) ? 'calculator' : undefined}
        />
      }
      setFocus={() => {
        if (inputRef.current !== null) setTimeout(inputRef.current.focus, 100)
      }}
    >
      <Form>
        <Segment basic className="flex-row-space-between-center" style={segmentStyle}>
          <p className="no-margin-no-padding">{strings.DATA_VIEW_FILTER_HIGHER}</p>
          <Input
            ref={inputRef}
            size="small"
            className="search"
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
            onChange={(_, { value }) => handleChange(value, 'upperBound')}
            value={upperInput}
            error={inputError.upperBound}
            style={inputStyle}
          />
        </Segment>
      </Form>
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
