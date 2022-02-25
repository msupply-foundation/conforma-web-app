import React from 'react'

import ComponentLibrary from './semanticComponentLibrary'
import { EvaluationType } from './types'

const DEFAULT_TYPE = 'string'

const types = ['string', 'array', 'number', 'boolean']

type EvaluationOutputTypeProps = {
  evaluation: EvaluationType
  setEvaluation: (evaluation: EvaluationType) => void
}

const EvaluationOutputType: React.FC<EvaluationOutputTypeProps> = ({
  evaluation,
  setEvaluation,
}) => {
  if (evaluation.type !== 'operator') return null

  const setType = (type?: string) => {
    setEvaluation({
      ...evaluation,
      asOperator: { ...evaluation.asOperator, type },
    })
  }

  const { type } = evaluation.asOperator
  return (
    <ComponentLibrary.FlexRow>
      <ComponentLibrary.Checkbox
        title="Specify Type"
        checked={!!type}
        setChecked={() => setType(!type ? DEFAULT_TYPE : undefined)}
        minLabelWidth={110}
      />
      {type && (
        <ComponentLibrary.Selector
          title=""
          selections={types}
          selected={type}
          setSelected={setType}
        />
      )}
    </ComponentLibrary.FlexRow>
  )
}

export default EvaluationOutputType
