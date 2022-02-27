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

  const [fallbackEnabled, setFallbackEnabled] = useState(!!fallback)
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
        checked={!!fallback}
        setChecked={() => setFallbackEnabled(!fallbackEnabled)}
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
