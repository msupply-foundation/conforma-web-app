/**
 * This is just a re-export of 'json-edit-react' but with some props permanently
 * set.
 */

import { JsonEditor, JsonEditorProps } from 'json-edit-react'
import JSON5 from 'json5'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { Position, useToast } from '../../../contexts/Toast'
import { handleCopyToClipboard } from './utils'

export const ReactJson = (props: JsonEditorProps) => {
  const { t } = useLanguageProvider()
  const { showToast } = useToast({ position: Position.topLeft })
  return (
    <JsonEditor
      enableClipboard={(input) => handleCopyToClipboard(input, t, showToast)}
      showArrayIndices={false}
      showCollectionCount="when-closed"
      jsonParse={JSON5.parse}
      {...props}
    />
  )
}
