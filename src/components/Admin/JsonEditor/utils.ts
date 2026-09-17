import { DefaultValueFunction, extract, NewKeyOptionsFunction } from 'json-edit-react'
import { truncateString } from 'fig-tree-editor-react'
import { Position, ToastProps } from '../../../contexts/Toast'
import { TranslateMethod } from '../../../contexts/Localisation'

// The fields shared by the copy event of both json-edit-react and
// fig-tree-editor-react, which both call this handler
interface CopyEventInfo {
  key: string | number
  value: unknown
  type: string
  stringValue: string
}

/**
 * Show toast for copy to clipboard actions. Shared between different
 * implementations of JsonEditor
 */
export const handleCopyToClipboard = (
  { key, value, type, stringValue }: CopyEventInfo,
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

/**
 * When adding a new key, generate the options based on the default preferences
 * structure
 */
type NewKeyFunction = (
  ...args: [...Parameters<NewKeyOptionsFunction>, defaultData: object, exclusions?: string[]]
) => ReturnType<NewKeyOptionsFunction>

export const newKeyOptions: NewKeyFunction = ({ key, path }, defaultData, exclusions = []) => {
  if (exclusions.includes(key as string)) return
  const object = extract(defaultData, path as string[], {})
  return Object.keys(object)
}

/**
 * The default value is added by pulling the value at the specified path from
 * the default data structure.
 */
type DefaultFunction = (
  ...args: [...Parameters<DefaultValueFunction>, defaultData: object]
) => ReturnType<DefaultValueFunction>

export const defaultValue: DefaultFunction = ({ path, value }, newKey, defaultData) => {
  if (Array.isArray(value)) {
    // If we're adding to an existing array, just get the first item from the
    // defaultPrefs array
    const defaultArray = extract(defaultData, path as string[], [])
    return defaultArray[0] ?? ''
  }

  const fullPath = [...path, newKey]
  return extract(defaultData, fullPath as string[], null)
}
