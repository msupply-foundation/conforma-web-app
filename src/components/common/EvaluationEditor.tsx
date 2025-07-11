import React from 'react'
import Markdown from '../../utils/helpers/semanticReactMarkdown'
import { FigTreeEditor, FigTreeEditorProps } from 'fig-tree-editor-react'
import { isFigTreeError, truncateString, dequal, EvaluatorNode } from 'fig-tree-evaluator'
import { Position, topMiddle, useToast } from '../../contexts/Toast'
import { useLanguageProvider } from '../../contexts/Localisation'
import { handleCopyToClipboard } from '../Admin/JsonEditor'

const RESULT_STRING_CHAR_LIMIT = 500

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
      console.log('Resetting', newData)
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
        onEvaluate={(result, e) => {
          let resultString = truncateString(String(result))
          let copiedToClipboardText = ''
          if (e.getModifierState('Meta') || e.getModifierState('Control')) {
            navigator.clipboard.writeText(String(result))
            copiedToClipboardText = '(Copied to clipboard)'
            resultString += `\n${copiedToClipboardText}`
          }
          showToast({
            text: resultString,
            html: formatResult(result, copiedToClipboardText),
            style: 'success',
            timeout: 10_000,
            maxWidth: 650,
          })
        }}
        onEvaluateError={(err) => {
          showToast({
            title: 'Evaluation Error',
            text: isFigTreeError(err)
              ? truncateString(err.prettyPrint, 150)
              : (err as Error).message,
            style: 'negative',
            timeout: 10_000,
            maxWidth: 650,
          })
        }}
        enableClipboard={(input) => handleCopyToClipboard(input, t, showToast)}
      />
    </div>
  )
}

const formatResult = (result: unknown, copiedToClipboardText?: string) => {
  const copiedToClipboard = copiedToClipboardText ? (
    <div style={{ textAlign: 'center' }}>
      <em>{copiedToClipboardText}</em>
    </div>
  ) : null

  let htmlResult: JSX.Element | null = null

  switch (typeof result) {
    case 'boolean':
    case 'number':
      // Returning undefined will force the Message component to render the
      // plain text result rather than the formatted HTML
      return undefined
    case 'object':
      if (result === null) {
        htmlResult = (
          <code>
            <strong>NULL</strong>
          </code>
        )
        break
      }
      htmlResult = (
        <pre>{truncateString(JSON.stringify(result, null, 2), RESULT_STRING_CHAR_LIMIT)}</pre>
      )
      break
    default:
      htmlResult = <Markdown text={truncateString(String(result), RESULT_STRING_CHAR_LIMIT)} />
  }

  return (
    <>
      {htmlResult}
      {copiedToClipboard}
    </>
  )
}
