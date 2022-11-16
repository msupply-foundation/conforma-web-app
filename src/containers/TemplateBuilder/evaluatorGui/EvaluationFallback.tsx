import React, { useState } from 'react'
import Evaluation from '../shared/Evaluation'

import ComponentLibrary from './semanticComponentLibrary'
import { EvaluationType } from './types'

type EvaluationOutputTypeProps = {
  evaluation: EvaluationType
  setEvaluation: (evaluation: EvaluationType) => void
}

const EvaluationFallback: React.FC<EvaluationOutputTypeProps> = ({ evaluation, setEvaluation }) => {
  const { fallback } = evaluation.asOperator

  const [fallbackEnabled, setFallbackEnabled] = useState(fallback !== undefined)
  if (evaluation.type !== 'operator') return null

  const setFallback = (fallbackValue?: any) => {
    setEvaluation({
      ...evaluation,
      asOperator: { ...evaluation.asOperator, fallback: fallbackValue },
    })
  }

  return (
    <div className="flex-row-start-center">
      <ComponentLibrary.Checkbox
        title="Enable Fallback"
        checked={fallbackEnabled}
        setChecked={() => {
          const newState = !fallbackEnabled
          if (newState)
            setEvaluation({
              ...evaluation,
              asOperator: { ...evaluation.asOperator, fallback: null },
            })
          else
            setEvaluation({
              ...evaluation,
              asOperator: { ...evaluation.asOperator, fallback: undefined },
            })
          setFallbackEnabled(newState)
        }}
        minLabelWidth={110}
      />
      {fallbackEnabled && (
        <>
          <Evaluation
            setEvaluation={(value: any) => setFallback(value)}
            key={'Fallback'}
            evaluation={fallback}
            currentElementCode={''}
            label={''}
          />
        </>
      )}
    </div>
  )
}

export default EvaluationFallback
