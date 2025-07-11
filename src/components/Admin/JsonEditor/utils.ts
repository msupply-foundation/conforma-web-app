import { CopyFunction } from 'json-edit-react'
import { truncateString } from 'fig-tree-editor-react'
import { Position, ToastProps } from '../../../contexts/Toast'
import { TranslateMethod } from '../../../contexts/Localisation'

/**
 * Show toast for copy to clipboard actions. Shared between different
 * implementations of JsonEditor
 */
export const handleCopyToClipboard = (
  { key, value, type, stringValue }: Parameters<CopyFunction>[0],
  t: TranslateMethod,
  showToast: (...state: Partial<ToastProps>[]) => void
) => {
  const text =
    typeof value === 'object' && value !== null
      ? t('CLIPBOARD_COPIED_ITEMS', { name: key, count: Object.keys(value).length })
      : truncateString(stringValue)
  showToast({
    title: t(type === 'value' ? 'CLIPBOARD_COPIED_VALUE' : 'CLIPBOARD_COPIED_PATH'),
    text,
    style: 'info',
    position: Position.bottomLeft,
  })
}
