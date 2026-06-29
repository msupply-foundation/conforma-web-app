/**
 * Re-exports of 'json-edit-react' with the app's shared display props applied:
 * `ReactJson` is the editable editor, `ReactJsonView` is the read-only viewer.
 */

import {
  JsonEditor,
  JsonEditorProps,
  JsonViewer,
  JsonViewerProps,
  OnCopyFunction,
} from 'json-edit-react'
import JSON5 from 'json5'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { Position, useToast } from '../../../contexts/Toast'
import { handleCopyToClipboard } from './utils'

// Display options shared by both the editor and the viewer, so all JSON views
// across the app look and behave consistently
const useSharedProps = () => {
  const { t } = useLanguageProvider()
  const { showToast } = useToast({ position: Position.topLeft })
  const onCopy: OnCopyFunction = (input) => handleCopyToClipboard(input, t, showToast)
  return {
    onCopy,
    showArrayIndexes: false,
    showCollectionCount: 'when-collapsed' as const,
  }
}

export const ReactJson = (props: JsonEditorProps) => {
  const shared = useSharedProps()
  return <JsonEditor jsonParse={JSON5.parse} {...shared} {...props} />
}

export const ReactJsonView = (props: JsonViewerProps) => {
  const shared = useSharedProps()
  return <JsonViewer {...shared} {...props} />
}

export default ReactJson
