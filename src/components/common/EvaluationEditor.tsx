import React from 'react'
import { FigTreeEditor, FigTreeEditorProps } from 'fig-tree-editor-react'
import JSON5 from 'json5'
import { Position, topMiddle, useToast } from '../../contexts/Toast'
import { useLanguageProvider } from '../../contexts/Localisation'
import { handleCopyToClipboard } from '../Admin/JsonEditor'
import { onEvaluateErrorNotify, onEvaluateNotify } from './evaluatorHelpers'
import { usePrefs } from '../../contexts/SystemPrefs'

interface EvaluatorProps extends Omit<FigTreeEditorProps, 'onEvaluate'> {
  toastPosition?: Position
  canEdit: boolean
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
  ...figTreeEditorProps
}) => {
  const { t } = useLanguageProvider()
  const { preferences } = usePrefs()

  const { showToast } = useToast({ position: toastPosition })

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
        setExpression={setExpression}
        figTree={figTree}
        objectData={objectData as Record<string, unknown>}
        allowEdit={canEdit}
        allowAdd={canEdit}
        allowDelete={canEdit}
        collapseAnimationTime={100}
        onEvaluate={(result, e) => onEvaluateNotify(result, e, showToast)}
        onEvaluateError={(err) => onEvaluateErrorNotify(err, showToast)}
        onCopy={(input) => handleCopyToClipboard(input, t, showToast)}
        jsonParse={JSON5.parse}
        addTopLevelFallback={null}
        {...preferences?.figTreeDefaults}
      />
    </div>
  )
}
