import React from 'react'
import { FigTreeEditor, FigTreeEditorProps } from 'fig-tree-editor-react'
import { dequal, EvaluatorNode } from 'fig-tree-evaluator'
import JSON5 from 'json5'
import { Position, topMiddle, useToast } from '../../contexts/Toast'
import { useLanguageProvider } from '../../contexts/Localisation'
import { handleCopyToClipboard } from '../Admin/JsonEditor'
import { onEvaluateErrorNotify, onEvaluateNotify } from './evaluatorHelpers'

interface EvaluatorProps extends Omit<FigTreeEditorProps, 'onEvaluate'> {
  toastPosition?: Position
  canEdit: boolean
  resetExpression?: (expression: EvaluatorNode) => void
  isCombinedView?: boolean
}

export const EvaluationEditor: React.FC<EvaluatorProps> = ({
  expression,
  setExpression,
  figTree,
  objectData,
  toastPosition = topMiddle,
  canEdit,
  isCombinedView = false,
  resetExpression,
  ...figTreeEditorProps
}) => {
  const { t } = useLanguageProvider()

  const { showToast } = useToast({ position: toastPosition })

  const handleUpdate = (newData: EvaluatorNode) => {
    // This somewhat clunky bit of logic handles the fact that when FigTree
    // expressions are loaded from the database, the keys are often in an
    // undesirable order (alphabetical, which puts "children" before
    // "operator"). The FigTree Editor's internal "validate" function handles
    // this, and puts the keys in a better order for presentation, but it adds
    // an item to the Undo queue in doing so. By distinguishing between "strict"
    // and "loose" equality, we can update the state *without* adding to the
    // queue by using the "reset" method rather than "setData" in this case.

    // Strict => key order must be the same
    const isStrictlyEqual = JSON.stringify(newData) === JSON.stringify(expression)

    // Loose => key order not considered
    const isLooselyEqual = dequal(newData, expression)

    if (isLooselyEqual && !isStrictlyEqual && resetExpression) {
      resetExpression(newData)
      return
    }

    if (isStrictlyEqual) return

    setExpression(newData)
  }

  const boldLevel = isCombinedView ? 1 : 0

  return (
    <div className="fig-tree-container">
      <FigTreeEditor
        minWidth={600}
        rootName=""
        {...figTreeEditorProps}
        styles={{
          property: ({ level }) => {
            if (level === boldLevel) return { fontWeight: 'bold' }
            return {}
          },
          container: 'transparent',
        }}
        expression={expression}
        setExpression={handleUpdate}
        figTree={figTree}
        objectData={objectData as Record<string, unknown>}
        restrictEdit={!canEdit}
        restrictAdd={!canEdit}
        restrictDelete={!canEdit}
        collapseAnimationTime={100}
        onEvaluate={(result, e) => onEvaluateNotify(result, e, showToast)}
        onEvaluateError={(err) => onEvaluateErrorNotify(err, showToast)}
        enableClipboard={(input) => handleCopyToClipboard(input, t, showToast)}
        jsonParse={JSON5.parse}
      />
    </div>
  )
}
