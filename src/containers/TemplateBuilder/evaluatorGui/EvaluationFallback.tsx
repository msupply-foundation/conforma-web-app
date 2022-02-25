import React, { useState } from 'react'
import CheckboxIO from '../shared/CheckboxIO'
import TextIO from '../shared/TextIO'
import { renderArrayControl } from './guiCommon'

import ComponentLibrary from './semanticComponentLibrary'
import { EvaluationType } from './types'

const DEFAULT_TYPE = 'string'

const types = ['string', 'array', 'number', 'boolean', 'null', 'object']

type EvaluationOutputTypeProps = {
  evaluation: EvaluationType
  setEvaluation: (evaluation: EvaluationType) => void
}

const EvaluationFallback: React.FC<EvaluationOutputTypeProps> = ({ evaluation, setEvaluation }) => {
  const { fallback } = evaluation.asOperator

  const [fallbackEnabled, setFallbackEnabled] = useState(!!fallback)
  const [fallbackType, setFallbackType] = useState(getType(fallback))
  if (evaluation.type !== 'operator') return null

  const setFallback = (fallbackValue?: any) => {
    setEvaluation({
      ...evaluation,
      asOperator: { ...evaluation.asOperator, fallback: fallbackValue },
    })
  }

  const changeFallbackType = (typeValue: any) => {
    if (typeValue === 'string') setFallback('')
    if (typeValue === 'number') setFallback(1)
    if (typeValue === 'boolean') setFallback(true)
    if (typeValue === 'array') setFallback(['text'])
    if (typeValue === 'object') setFallback({ key: 'value' })
    if (typeValue === 'null') setFallback(null)
    setFallbackType(typeValue)
  }

  const componentFromTypeMap: { [key: string]: any } = {
    string: <TextIO minLabelWidth={108} text={fallback} setText={setFallback} />,
    boolean: <CheckboxIO title="" value={!!fallback} setValue={setFallback} />,
    number: <ComponentLibrary.NumberInput number={fallback} setNumber={setFallback} />,
    array: <ComponentLibrary.ObjectInput object={fallback} setObject={setFallback} />,
    object: <ComponentLibrary.ObjectInput object={fallback} setObject={setFallback} />,
    null: null,
  }

  return (
    <ComponentLibrary.FlexRow>
      <ComponentLibrary.Checkbox
        title="Enable Fallback"
        checked={!!fallback}
        setChecked={() => setFallbackEnabled(!fallbackEnabled)}
        minLabelWidth={110}
      />
      {fallbackEnabled && (
        <>
          <ComponentLibrary.Selector
            title="Type"
            selections={types}
            selected={'string'}
            setSelected={changeFallbackType}
          />
          {fallbackType in componentFromTypeMap ? (
            componentFromTypeMap?.[fallbackType]
          ) : (
            <p>Not implemented</p>
          )}
        </>
      )}
    </ComponentLibrary.FlexRow>
  )
}

export default EvaluationFallback

const getType = (value: any) => {
  if (value === null) return 'null'
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'boolean') return 'boolean'
  if (Array.isArray(value)) return 'array'
  if (typeof value == 'object') return 'object'
  return 'string'
}
