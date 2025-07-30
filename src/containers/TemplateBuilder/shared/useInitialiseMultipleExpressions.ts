/**
 * When loading evaluator expressions from the database, the keys are often in
 * an undesirable order (alphabetical, but "operator" should come first). The
 * FigTree Editor's internal "validate" function handles this (among other
 * checks), and puts the keys in a better order for presentation. However this
 * causes two problems:
 *  - It adds an unnecessary item to the Undo queue
 *  - Simultaneous updates to multiple expressions (e.g. the "Parameters"
 *    object, or the "CommonData" in form elements) causes a race condition
 *    where only the last update is applied (we can't use the functional form of
 *    setState here because we're using useUndo's "setData" method, which
 *    doesn't support it)
 *
 * So this hook allows for an "initialisation" phase where the parameters are
 * validated all at once (using a mutable ref), then applied with a
 * `setParameters` call via a "reset", which doesn't add to the Undo queue.
 *
 * After this initialisation phase, the `updateExpression` function can be used
 * to update individual parameters without triggering the initialisation logic
 * again.
 */

const INITIALISATION_PHASE_DURATION = 500 //ms

import { useEffect, useRef } from 'react'
import { ParametersType } from './Parameters'
import { EvaluatorNode } from 'fig-tree-editor-react'

export const useInitialiseMultipleExpressions = (
  expressionGroup: ParametersType,
  setExpressionGroup: (parameters: ParametersType) => void,
  isActive: boolean,
  reset: (expression: EvaluatorNode, key?: string) => void
) => {
  const isInitializing = useRef(true)
  const expressionsRef = useRef<ParametersType>({ ...expressionGroup })

  useEffect(() => {
    if (!isActive || !isInitializing.current) return
    const timer = setTimeout(() => {
      isInitializing.current = false
      reset({ ...expressionsRef.current })
      console.log('Expression group initialized:', expressionsRef.current)
    }, INITIALISATION_PHASE_DURATION)

    return () => clearTimeout(timer)
  }, [isActive, reset])

  const updateExpression = (key: string, value: EvaluatorNode) => {
    if (isInitializing.current) {
      expressionsRef.current[key] = value
    } else {
      setExpressionGroup({ ...expressionGroup, [key]: value })
    }
  }

  return { updateExpression }
}
