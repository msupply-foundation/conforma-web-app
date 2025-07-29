import { Position, ToastProps } from '../../contexts/Toast'
import Markdown from '../../utils/helpers/semanticReactMarkdown'
import { isFigTreeError, truncateString } from 'fig-tree-editor-react'

const RESULT_STRING_CHAR_LIMIT = 500

export const onEvaluateNotify = (
  result: unknown,
  e: React.MouseEvent<Element, MouseEvent>,
  toast: (...state: Partial<ToastProps>[]) => void
) => {
  let resultString = truncateString(String(result))
  let copiedToClipboardText = ''
  if (e.getModifierState('Meta') || e.getModifierState('Control')) {
    navigator.clipboard.writeText(String(result))
    copiedToClipboardText = '(Copied to clipboard)'
    resultString += `\n${copiedToClipboardText}`
  }
  toast({
    text: resultString,
    html: formatResult(result, copiedToClipboardText),
    style: 'success',
    timeout: 10_000,
    maxWidth: 650,
    position: Position.topMiddle,
  })
}

export const onEvaluateErrorNotify = (
  err: unknown,
  toast: (...state: Partial<ToastProps>[]) => void
) => {
  console.log('Evaluation error:', isFigTreeError(err) ? err.prettyPrint : (err as Error).message)
  toast({
    title: 'Evaluation Error',
    text: isFigTreeError(err) ? truncateString(err.prettyPrint, 150) : (err as Error).message,
    style: 'negative',
    timeout: 10_000,
    maxWidth: 650,
    position: Position.topMiddle,
  })
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
      if (result === '') htmlResult = <p>&lt;empty string&gt;</p>
      else htmlResult = <Markdown text={truncateString(String(result), RESULT_STRING_CHAR_LIMIT)} />
  }

  return (
    <>
      {htmlResult}
      {copiedToClipboard}
    </>
  )
}
